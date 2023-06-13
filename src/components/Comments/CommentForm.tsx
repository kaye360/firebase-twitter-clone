import { useContext, useState } from "react"
import { AppContext } from "../../App"
import { createComment } from "../../services/CommentService"
import Button from "../Layout/Button"
import { MAX_COMMENT_LENGTH } from "../../utils/appConfig"
import ValidatedForm from "../ValidatedForm/components/ValidatedForm"
import ValidatedField from "../ValidatedForm/components/ValidatedField"
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../ValidatedForm/components/SubmitSuccessMessage"
import { auth } from "../../../firebase-config"

interface CommentFormProps {
    postId : string,
    targetUserId : string,
}

export default function CommentForm({ postId, targetUserId } : CommentFormProps) {

    const [commentBody, setCommentBody]    = useState<string>('')
    const { appContext, handleFormSubmit } = useCommentForm({ postId, targetUserId, commentBody })


    if( !auth.currentUser ) {
        return <></>
    }


    return (
        <div id="comment-form">

            <h2 className="my-4 py-2 border-b border-slate-200">
                Post a Comment
            </h2>

            <ValidatedForm 
                handleSubmit={handleFormSubmit}
                config={{successMessage : 'Comment posted.'}}
                rules={{auth : true}}
            >

                <div className="flex justify-between mb-2">
                    <label htmlFor="comment-body">Posting as { appContext?.userHandle }: </label>
                    <span className={ commentBody.length > MAX_COMMENT_LENGTH ? 'text-red-500' : ''}>
                        {commentBody.length} / {MAX_COMMENT_LENGTH}
                    </span>
                </div>

                <ValidatedField
                    type="textarea" 
                    title={"Comment"} 
                    id="comment-body"
                    value={commentBody}
                    setValue={setCommentBody} 
                    rules={{
                        required : true,
                        maxLength : MAX_COMMENT_LENGTH
                    }}                
                />
                
                <div className="flex items-center gap-4">
                    <Button 
                        icon="chat_bubble" 
                        className="bg-blue-200 text-blue-700 hover:bg-orange-100 hover:text-orange-400"
                    >
                        Post Comment
                    </Button>

                    <SubmitErrorMessage />
                    <SubmitSuccessMessage />

                </div>
            </ValidatedForm>

        </div>
    )
}



interface UseCommentFormProps extends CommentFormProps {
    commentBody : string,
}

function useCommentForm({ postId, targetUserId, commentBody } : UseCommentFormProps) {


    const appContext  = useContext(AppContext)


    async function handleFormSubmit() {
           
        await createComment({
            postId,
            targetUserId, 
            userId       : appContext?.firebaseAuth?.uid as string,
            userHandle   : appContext?.userHandle as string,
            comment      : commentBody,
        })
    }


    return { appContext, handleFormSubmit }
}