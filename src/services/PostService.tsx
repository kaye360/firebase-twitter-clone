import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { auth, db } from "../../firebase-config"
import { Post, ResponseSuccess } from "../utils/types"
import { sendNotification } from "./NotificationService"
import { extractHashtags } from "../utils/hashtags"





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

export async function createPost({body, repostId = null, targetUserId = null, userHandle = null} : CreatePostProps) : Promise<ResponseSuccess> {
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

        return { 
            success : true, 
            message : 'Post created! Redirecting...',
            content : post.id
        } as ResponseSuccess

    } catch (error: any) {
        
        return { 
            success : false, 
            message : error.toString()
        } as ResponseSuccess
    }

}




export async function deletePost(id : string) : Promise<ResponseSuccess> {
    try {
        const postToDelete = doc(db, "posts", id)
        await deleteDoc(postToDelete)

        return {
            success : true,
            message : 'Post deleted successfully.'
        } as ResponseSuccess

    } catch (error: any) {
        return {
            success : false,
            message : error.toString()
        } as ResponseSuccess
    }
}




export async function updatePostBody(id : string, body : string) : Promise<ResponseSuccess> {
		
    try {
        if( !body || body === '' || typeof body !== 'string' ) {
            throw 'Invalid post body'
        }

        if( !auth.currentUser ) {
            throw 'You must be logged in to post'
        }

        const hashtags = extractHashtags({string : body})

        const postDocToEdit = doc(db, "posts", id)
        await updateDoc(postDocToEdit, {body, hashtags})


        return {
            success : true,
            message : 'Post Saved!',
        } as ResponseSuccess

    } catch (error: any) {
        return {
            success : false,
            message : error.toString()
        }
    }
}




interface ToggleLikePostProps {
    postId     : string,
    userId     : string,
    userHandle : string,
}

export async function toggleLikePost({ postId, userId, userHandle } : ToggleLikePostProps) : Promise<ResponseSuccess> {
    try {
        const post              = await(getPost(postId)) as Post
        const postIsLikedByUser = post?.likes?.includes(userId)
        
        const updatedLikes: string[] = postIsLikedByUser
            ? post.likes.filter( likedId => likedId != userId )
            : [...post.likes, userId]

        const postDocToEdit = doc(db, "posts", postId)
        await updateDoc(postDocToEdit, {likes : updatedLikes})
        
        if( !postIsLikedByUser ) sendNotification({
            userId       : post.userId, 
            notification : {
                message : `${userHandle} liked your post: "${post.body}`,
                type    :  'like',
                link    : `/post/${post.id}`
            }
        })
        
        return { success: true, message: '' } as ResponseSuccess
        
    } catch (error) {
        return { success: false, message: '' } as ResponseSuccess
    }
    

}