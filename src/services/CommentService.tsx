import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase-config"
import { ResponseSuccess } from "../utils/types"
import { getPost, Post } from "./PostService"


export interface PostComment {
    postId    : string,
    userId    : string,
    comment   : string,
    commentId : string
}



interface CreateCommentProps {
    postId     : string,
    userId     : string,
    userHandle : string,
    comment    : string
}

export async function createComment({postId, userId, comment} : CreateCommentProps) : Promise<ResponseSuccess> {
    try {

        const commentPost             = await(getPost(postId)) as Post
        const commentId               = crypto.randomUUID()
        const newComment: PostComment = { postId, userId, comment, commentId }
        const updatedComments         = [...commentPost.comments, newComment]
        const postDocToEdit           = doc(db, "posts", postId)

        await updateDoc(postDocToEdit, {comments : updatedComments})

        return { success : true, message : 'Comment created!' } as ResponseSuccess
    } catch (error) {
        
        return { success : false, message : 'Something went wrong...' } as ResponseSuccess
    }
}
