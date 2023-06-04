import { useContext, useState, FormEvent, SyntheticEvent, useEffect } from "react"
import { AppContext } from "../../App"
import { createComment } from "../../services/CommentService"
import Button from "../Button"

interface CommentFormProps {
    postId : string,
    targetUserId : string,
}

export default function CommentForm({ postId, targetUserId } : CommentFormProps) {

    const appContext  = useContext(AppContext)

    const [commentBody, setCommentBody]     = useState<string>('')
    const [errorMessage, setErrorMessage]   = useState<string>('')
    const [submitMessage, setSubmitMessage] = useState<string>('')
    const [isValidated, setIsValidated]     = useState<boolean>(true)

    const validateComment   = () : void => setIsValidated(true)
    const invalidateComment = () : void => setIsValidated(false)

    function resetForm() {
        setCommentBody('')
        setErrorMessage('')
        setSubmitMessage('')
        setIsValidated(true)
    }
    
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const isLoggedIn = typeof appContext?.firebaseAuth?.uid === 'string' && 
                           typeof appContext?.userHandle === 'string'
        const isEmpty    = !commentBody.trim() || commentBody.trim().length === 0

        if( !isLoggedIn ) {
            setSubmitMessage('You must be logged in to post')
            return
        }

        if( !isValidated ) {
            setSubmitMessage("Comment invalid. Please check your comment for errors")
            return
        }

        if( isEmpty ) {
            setSubmitMessage('Please enter a comment.')
            return
        }
           
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

    function handleChange(e: SyntheticEvent) {
        if( e.target instanceof HTMLTextAreaElement ) {
            setCommentBody(e.target.value)
        }
    }

    useEffect( () => {
        ( function validateCommentBody() {

            const isTooLong = commentBody.length > 200
            invalidateComment()

            if( isTooLong ) {
                setErrorMessage('Comment must be less than 200 characters')

            } else { // Validated
                setErrorMessage('')
                validateComment()
            }
        })()
    }, [commentBody])


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

                <div className={` ${errorMessage ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-rose-500 py-2`}>
                    <div className="overflow-hidden">
                        { errorMessage }
                    </div>
                </div>

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
                        disabled={!isValidated} 
                        className="bg-blue-200 text-blue-700 hover:bg-orange-100 hover:text-orange-400"
                    >
                        Post Comment
                    </Button>

                    <div>
                        {submitMessage}
                    </div>
                </div>
            </form>

        </div>
    )
}




