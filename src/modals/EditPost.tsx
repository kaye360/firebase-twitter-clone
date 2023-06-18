import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { deletePost, updatePostBody } from "../services/PostService"
import { MAX_POST_LENGTH, REDIRECT_TIME } from "../utils/appConfig"
import useExtractHashtags from "../hooks/useExtractHashtags"
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm"
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../components/ValidatedForm/components/SubmitSuccessMessage"
import useLoadRepost from "../hooks/useLoadRepost"
import ValidatedField from "../components/ValidatedForm/components/ValidatedField"
import RepostPreview from "../components/Posts/RepostPreview"
import HashtagsPreview from "../components/Posts/HashtagsPreview"
import Button from "../components/Layout/Button"
import { ModalContext } from "../App"
import useUser from "../hooks/useUser"


interface EditPostProps {
    postId           : string | undefined,
    postBody?        : string,
    defaultPostBody? : string,
    repostId?        : string | null,
}

export default function EditPost({postId, defaultPostBody = '', repostId = null} : EditPostProps) {


    const [postBody, setPostBody] = useState<string>(defaultPostBody)

    const user = useUser()
    

    const { 
        handleFormSubmit, 
        handleDelete, 
        deleteBtnText,
        hasDeleted,
    } = useEditPost({postId, postBody})


    // Load repost if repostId is given
    const { repost } = useLoadRepost({repostId})
    

    const { hashtags, hasHashtags } = useExtractHashtags({string : postBody})

    return (
        <ValidatedForm 
            handleSubmit={handleFormSubmit}
            config={{ successMessage : 'Post updated successfully. Closing...' }}
            rules={{ auth : true }}
        >
            <div className="grid gap-4">

                <h2>Edit Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="create-post-postBody">Posting as {user.handle}</label>
                    <span className={postBody.length > MAX_POST_LENGTH ? 'text-red-400 font-bold' : ''}>
                        {postBody.length} / {MAX_POST_LENGTH}
                    </span>
                </div>

                <ValidatedField
                    type="textarea"
                    title="Post"
                    value={postBody}
                    setValue={setPostBody}
                    rules={{
                        required : true,
                        maxLength : MAX_POST_LENGTH
                    }}
                />

                { repostId && <RepostPreview repost={repost} /> }

                <HashtagsPreview hashtags={hashtags} hasHashtags={hasHashtags} />   

                <div className="flex items-center justify-start w-full gap-4">
                    <Button className="bg-blue-200 hover:bg-orange-200">
                        Save
                    </Button>

                    <SubmitErrorMessage />
                    <SubmitSuccessMessage />


                    { hasDeleted ? (
                        <span className="ml-auto">
                            Post deleted. Closing...
                        </span>
                    ) : (
                        <Button 
                            className="bg-rose-100 hover:bg-orange-200 ml-auto"
                            onClick={ (e) => handleDelete(postId as string, e) }
                        >
                            {deleteBtnText}
                        </Button>
                    )}
                </div>
            </div>
        </ValidatedForm>
    )
}




function useEditPost({postBody, postId} : EditPostProps) {


    const modal = useContext(ModalContext)

    const [deleteBtnText, setDeleteBtnText]           = useState<string>('Delete')
    const [hasConfirmedDelete, setHasConfirmedDelete] = useState<boolean>(false)
    const [hasDeleted, setHasDeleted]                 = useState<boolean>(false)


    async function handleFormSubmit() : Promise<void> {
        const res = await updatePostBody(postId as string, postBody as string)
        
        if( res.success) {
            setTimeout( () => modal.close(), REDIRECT_TIME)
        }
    }


    async function handleDelete(id: string, e: SyntheticEvent) : Promise<void> {
        e.preventDefault()

        if(!hasConfirmedDelete) {
            setDeleteBtnText('Are you sure?')
            setHasConfirmedDelete(true)
            return
        }

        const res = await deletePost(id)

        if(res.success) {
            setHasDeleted(true)
            setTimeout( () => modal.close(), REDIRECT_TIME)
        }
    }


    useEffect( () => {
        resetDeleteBtn()
    }, [postBody])

    
    function resetDeleteBtn() {
        setDeleteBtnText('Delete')
        setHasConfirmedDelete(false)
    }

    
    return { handleFormSubmit, handleDelete, deleteBtnText, hasDeleted }
}