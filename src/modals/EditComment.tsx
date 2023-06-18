import { useContext, useState } from "react"
import { PostComment } from "../utils/types"
import { editComment } from "../services/CommentService"
import Button from "../components/Layout/Button"
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm"
import ValidatedField from "../components/ValidatedForm/components/ValidatedField"
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../components/ValidatedForm/components/SubmitSuccessMessage"
import { MAX_COMMENT_LENGTH, REDIRECT_TIME } from "../utils/appConfig"
import { ModalContext } from "../App"

interface EditCommentProps {
    comment : PostComment,
}

export default function EditComment({comment} : EditCommentProps) {


    const [commentBody, setCommentBody] = useState<string>(comment.comment)
    const { handleFormSubmit }          = useEditComment({comment, commentBody})


    return (
        <ValidatedForm 
            handleSubmit={ handleFormSubmit }
            config={{successMessage : 'Comment edited successfully. Closing...'}}
            rules={{auth : true}}
        >

            <div className="flex flex-col gap-4 items-start">

                <div className="flex items-center justify-between w-full">
                    <h2>
                        Edit Comment
                    </h2>   

                    <span className={commentBody.length > 200 ? 'text-rose-400' : ''}>
                        {commentBody.length} / 200
                    </span>
                </div>

                <ValidatedField 
                    type="textarea"
                    title="Comment"
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
                        Edit Comment
                    </Button>

                    <SubmitErrorMessage />
                    <SubmitSuccessMessage />
                </div>

            </div>

        </ValidatedForm>
    )
}





interface UseEditCommentProps extends EditCommentProps {
    commentBody : string
}

function useEditComment({commentBody, comment} : UseEditCommentProps) {


    const modal = useContext(ModalContext)
    const { postId, userId, commentId } = comment


    async function handleFormSubmit() {

        const res = await editComment({
            postId,
            userId,
            commentId,
            comment : commentBody
        })

        if(res.success) {
            setTimeout( () => {
                modal.close()
            }, REDIRECT_TIME)
        }
    }

    return { handleFormSubmit }
}
