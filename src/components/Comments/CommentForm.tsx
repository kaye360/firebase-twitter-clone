import { useContext, FormEvent, SyntheticEvent } from "react"
import { AppContext } from "../../App"
import { createComment } from "../../services/CommentService"
import ValidationError from "../Validation/ValidationError"
import useValidateComment from "../../hooks/useValidateComment"
import Button from "../Layout/Button"

interface CommentFormProps {
    postId : string,
    targetUserId : string,
}

export default function CommentForm({ postId, targetUserId } : CommentFormProps) {

    const appContext  = useContext(AppContext)


    const { 
        commentBody, setCommentBody, 
        submitMessage, setSubmitMessage, 
        isOnChangeValidated, 
        isOnSubmitValidated,
        errorMessage, 
        resetForm, 
    } = useValidateComment({})


    function handleChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLTextAreaElement) ) return
        setCommentBody(e.target.value)
    }


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const isValidComment = await isOnSubmitValidated()
        if( !isValidComment) return
           
        const res = await createComment({
            postId,
            targetUserId, 
            userId       : appContext?.firebaseAuth?.uid as string,
            userHandle   : appContext?.userHandle as string,
            comment      : commentBody,
        })
        
        setSubmitMessage(res.message)

        setTimeout( resetForm, 5000)
    }


    if( !appContext?.userHandle || !appContext.firebaseAuth) {
        return <></>
    }


    return (
        <div id="comment-form">

            <h2 className="my-4 py-2 border-b border-slate-200">
                Post a Comment
            </h2>

            <form onSubmit={handleSubmit} >

                <div className="flex justify-between">
                    <label htmlFor="comment-body">Posting as { appContext?.userHandle }: </label>
                    <span>{commentBody.length} / 200</span>
                </div>

                <ValidationError message={errorMessage} />

                <textarea
                    className="h-36"
                    value={commentBody}
                    onChange={ handleChange }
                    placeholder="Please enter your comment"
                    id="comment-body"
                ></textarea>

                <div className="flex items-center gap-4">
                    <Button 
                        icon="chat_bubble" 
                        disabled={!isOnChangeValidated} 
                        className="bg-blue-200 text-blue-700 hover:bg-orange-100 hover:text-orange-400"
                    >
                        Post Comment
                    </Button>

                    <span>
                        {submitMessage}
                    </span>
                </div>
            </form>

        </div>
    )
}
