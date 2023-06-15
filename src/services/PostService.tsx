import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { auth, db } from "../../firebase-config"
import { Post, AsynchronousResponse } from "../utils/types"
import { sendNotification } from "./NotificationService"
import { extractHashtags } from "../utils/hashtags"
import { AsyncResponse } from "../utils/AsyncResponse"





export const postCollectionRef = collection(db, "posts")


/**
 * 
 * To get a post that needs to automatically update
 * in realtime, use the useGetSinglePost Hook
 * 
 * This function is fine for getting a post statically.
 * 
 */
export async function getPost(id: string | undefined) : Promise<Post | null> {
    try {
        if( !id ) return null

        const postRef = doc(db, "posts", id)
        const post    = await getDoc(postRef)
    
        if( post.exists() ) {
            const postData = post.data()
            const userRef  = doc(db, "users", postData.userId)
            const user     = await getDoc( userRef )
            const userData = user.data()
            postData.user  = userData
            postData.id    = post.id
            return postData as Post
        } 

        return null
        
    } catch (error) {
        return null
    }

}




interface CreatePostProps {
    body          : string,
    repostId?     : string | null,
    targetUserId? : string | null,
    userHandle?   : string | null,
}

export async function createPost({body, repostId = null, targetUserId = null, userHandle = null} : CreatePostProps) : Promise<AsynchronousResponse> {
    try {

        const hashtags = extractHashtags({string: body})
        
        const post = await addDoc(postCollectionRef,  {
            body,
            repostId,
            hashtags,
            date     : Timestamp.fromDate(new Date()),
            userId   : auth.currentUser?.uid,
            likes    : [],
            comments : [],
            reposts  : 0
        })

        /**
         * If post is a Repost, increment repost count and send notification to original poster
         */
        if( repostId && targetUserId && userHandle ) {
            
            const repostRef = doc(db, "posts", repostId)
            await updateDoc( repostRef, { reposts: increment(1) })
    
            await sendNotification({
                userId       : targetUserId,
                notification : {
                    message : `${userHandle} reposted your post: "${body}`,
                    type    :  'repost',
                    link    : `/post/${post.id}`
                }
            })
        }

        return AsyncResponse.success({message : 'Post created. Redirecting...', content : post.id})

    } catch (error: any) {
        return AsyncResponse.error({message : error.toString()})
    }

}




export async function deletePost(id : string) : Promise<AsynchronousResponse> {
    try {
        const postToDelete = doc(db, "posts", id)
        await deleteDoc(postToDelete)

        return AsyncResponse.success({message : 'Post deleted.'})

    } catch (error: any) {
        return AsyncResponse.error({message : error.toString()})
    }
}




export async function updatePostBody(id : string, body : string) : Promise<AsynchronousResponse> {
		
    try {
        const hashtags = extractHashtags({string : body})

        const postDocToEdit = doc(db, "posts", id)
        await updateDoc(postDocToEdit, {body, hashtags})

        return AsyncResponse.success({message : 'Post Saved.'})

    } catch (error: any) {
        return AsyncResponse.error({message : error.toString()})
    }
}




interface ToggleLikePostProps {
    postId     : string,
    userId     : string,
    userHandle : string,
}

export async function toggleLikePost({ postId, userId, userHandle } : ToggleLikePostProps) : Promise<AsynchronousResponse> {
    try {
        const post              = await(getPost(postId)) as Post
        const isPostLikedByUser = post?.likes?.includes(userId)
        
        const updatedLikes: string[] = isPostLikedByUser
            ? post.likes.filter( likedId => likedId != userId )
            : [...post.likes, userId]

        const postDocToEdit = doc(db, "posts", postId)
        await updateDoc(postDocToEdit, {likes : updatedLikes})
        
        if( !isPostLikedByUser ) sendNotification({
            userId       : post.userId, 
            notification : {
                message : `${userHandle} liked your post: "${post.body}`,
                type    :  'like',
                link    : `/post/${post.id}`
            }
        })
        
        return AsyncResponse.success()
        
    } catch (error) {
        return AsyncResponse.error()
    }
    

}