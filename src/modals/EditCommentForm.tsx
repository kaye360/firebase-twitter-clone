import { SyntheticEvent } from "react"
import { PostComment } from "../utils/types"
import Button from "../components/Button"
import useValidateComment from "../hooks/useValidateComment"
import ValidationError from "../components/Validation/ValidationError"
import { editComment } from "../services/CommentService"

interface EditCommentProps {
    comment : PostComment,
}

export default function EditCommentForm({comment} : EditCommentProps) {


    const { 
        commentBody, 
        handleOnChange, 
        handleSubmit, 
        errorMessage, 
        submitMessage, 
        isOnChangeValidated
    } = useEditCommentForm({comment})


    return (
        <form onSubmit={ handleSubmit }>

            <div className="flex flex-col gap-4 items-start">

                <div className="flex items-center justify-between w-full">
                    <h2>
                        Edit Comment
                    </h2>   

                    <span className={commentBody.length > 200 ? 'text-rose-400' : ''}>
                        {commentBody.length} / 200
                    </span>
                </div>

                <ValidationError message={errorMessage} />

                <textarea
                    value={commentBody}
                    onChange={ handleOnChange }
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

                <div className="flex items-center gap-4">
                    <Button
                        icon="chat_bubble"
                        disabled={!isOnChangeValidated}
                        className="bg-blue-200 text-blue-700 hover:bg-orange-100 hover:text-orange-400"
                    >
                        Edit Comment
                    </Button>

                    <span>
                        {submitMessage}
                    </span>
                </div>

            </div>

        </form>
    )
}



function useEditCommentForm({comment} : EditCommentProps) {

    const { 
        commentBody, setCommentBody, 
        submitMessage, setSubmitMessage, 
        isOnChangeValidated, 
        isOnSubmitValidated,
        errorMessage, 
    } = useValidateComment({defaultCommentBody : comment.comment})

    const { postId, userId, commentId } = comment


    function handleOnChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLTextAreaElement) ) return
        setCommentBody(e.target.value)
    }


    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()

        const isValidComment = await isOnSubmitValidated()
        if( !isValidComment ) return

        const res = await editComment({
            postId,
            userId,
            commentId,
            comment : commentBody
        })

        setSubmitMessage(res.message)
    }

    return { handleOnChange, handleSubmit, commentBody, errorMessage, submitMessage, isOnChangeValidated}
}