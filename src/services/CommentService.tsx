import { DocumentData, DocumentSnapshot, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase-config"
import { Post, PostComment, AsynchronousResponse } from "../utils/types"
import { getPost } from "./PostService"
import { sendNotification } from "./NotificationService"
import { AsyncResponse } from "../utils/AsyncResponse"



interface CreateCommentProps {
    postId       : string,
    userId       : string,
    userHandle   : string,
    comment      : string,
    targetUserId : string,
}

export async function createComment({postId, userId, userHandle, comment, targetUserId} : CreateCommentProps) : Promise<AsynchronousResponse> {
    try {

        const commentPost             = await(getPost(postId)) as Post
        const commentId               = crypto.randomUUID()
        const newComment: PostComment = { postId, userId, comment, commentId }
        const updatedComments         = [...commentPost.comments, newComment]
        const postDocToEdit           = doc(db, "posts", postId)

        await updateDoc(postDocToEdit, {comments : updatedComments})

        await sendNotification({
            userId       : targetUserId,
            notification : {
                message : `${userHandle} commented on your post: "${comment}`,
                type    :  'comment',
                link    : `/post/${postId}`
            }
        })

        return AsyncResponse.success({message : 'Comment Created!'})
    } catch (error) {
        
        return AsyncResponse.error({message : 'Something went wrong.'})
    }
}




interface EditCommentProps {
    postId    : string,
    userId    : string,
    commentId : string,
    comment   : string,
}

export async function editComment({postId, userId, commentId, comment} : EditCommentProps) : Promise<AsynchronousResponse> {
    try {

        const updatedComment: PostComment = { postId, userId, commentId, comment }
        const postDocToEdit               = doc(db, "posts", postId)
        const post                        = await getDoc(postDocToEdit)
        const comments                    = updateCommentArray({post, commentId, updatedComment})

        await updateDoc(postDocToEdit, {comments})

        return AsyncResponse.success({message : 'Comment updated!'})
        
    } catch (error) {
        return AsyncResponse.error({message : 'Something went wrong.'})
    }
}




interface UpdateCommentArrayProps {
    post           : DocumentSnapshot<DocumentData>,
    commentId      : string,
    updatedComment : PostComment
}

/**
 * @function updateCommentArray Helper function
 * 
 * Updates old comment with updated comment while preserving position in the array of comments
 */
function updateCommentArray({post, commentId, updatedComment} : UpdateCommentArrayProps) : PostComment[] {
    const comments  = post.data()?.comments as PostComment[]
    const index     = comments.findIndex(comment => comment.commentId === commentId)
    comments[index] = updatedComment
    return comments
}