import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { auth, db } from "../../firebase-config"
import { ResponseSuccess } from "../utils/types"
import { User } from "./UserServices"
import { PostComment } from "./CommentService"


export interface Post {
    // postData  : any
    body      : string,
    date      : Timestamp,
    userId    : string,
    id        : string | undefined,
    user?     : User,
    likes     : string[],
    comments  : PostComment[],
    reposts   : number,
    repostId? : string
}


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
            return postData as Post
        } 

        return null
        
    } catch (error) {
        return null
    }

}


export async function createPost(body: string) : Promise<ResponseSuccess> {
    try {
        if( !body || body === '' || typeof body !== 'string' ) {
            throw 'Invalid post body'
        }

        if( !auth.currentUser ) {
            throw 'You must be logged in to post'
        }

        const post = await addDoc(postCollectionRef,  {
            body,
            date     : Timestamp.fromDate(new Date()),
            userId   : auth.currentUser?.uid,
            likes    : [],
            comments : [],
            reposts  : 0
        })

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


export async function createRepost(body: string, repostId: string) : Promise<ResponseSuccess> {
    try {
        if( typeof body !== 'string' || typeof repostId !== 'string' ) {
            throw 'Invalid post body or repostId'
        }

        if( !auth.currentUser ) {
            throw 'You must be logged in to post'
        }
        
        const post = await addDoc(postCollectionRef,  {
            body,
            repostId,
            date     : Timestamp.fromDate(new Date()),
            userId   : auth.currentUser?.uid,
            likes    : [],
            comments : [],
            reposts  : 0
        })

        const repostRef = doc(db, "posts", repostId)
        await updateDoc( repostRef, { reposts: increment(1) })

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

        const postDocToEdit = doc(db, "posts", id)
        await updateDoc(postDocToEdit, {body})


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
    postId : string,
    userId : string
}

export async function toggleLikePost({ postId, userId } : ToggleLikePostProps) : Promise<ResponseSuccess> {
    try {
        const post = await(getPost(postId)) as Post
        
        const updatedLikes: string[] = post?.likes?.includes(userId)
            ? post.likes.filter( likedId => likedId != userId )
            : [...post.likes, userId]

        const postDocToEdit = doc(db, "posts", postId)
        await updateDoc(postDocToEdit, {likes : updatedLikes})

        return { success: true, message: '' } as ResponseSuccess
        
    } catch (error) {
        console.log(error)
        return { success: false, message: '' } as ResponseSuccess
    }
    

}