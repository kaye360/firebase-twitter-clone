import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { deletePost, updatePostBody } from "../services/PostService"
import { MAX_POST_LENGTH, REDIRECT_TIME } from "../utils/appConfig"
import { AppContext } from "../App"
import Button from "../components/Button"
import useExtractHashtags from "../hooks/useExtractHashtags"
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm"
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../components/ValidatedForm/components/SubmitSuccessMessage"
import useLoadRepost from "../hooks/useLoadRepost"
import Avatar from "../components/Avatar"
import ValidatedField from "../components/ValidatedForm/components/ValidatedField"


interface EditPostProps {
    postId           : string | undefined,
    postBody?        : string,
    defaultPostBody? : string,
    repostId?        : string | null,
}

export default function EditPost({postId, defaultPostBody = '', repostId = null} : EditPostProps) {


    const [postBody, setPostBody] = useState<string>(defaultPostBody)
    

    const { 
        appContext,
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
            config={{ successMessage : 'Post update successfully. Closing...' }}
            rules={{ auth : true }}
        >
            <div className="grid gap-4">

                <h2>Edit Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="create-post-postBody">Posting as {appContext?.userHandle}</label>
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

                { repostId && 
                    <div className="bg-blue-100 border border-blue-200 w-full rounded-lg p-4">
                        <h3 className="font-bold mb-4 border-b border-slate-300">Reposting:</h3>

                        { repost ? (
                            <div>
                                <h4 className="flex items-center gap-2 mb-2 font-bold text-blue-700">
                                    <Avatar src={repost.user?.avatar} className="w-8 h-8" />
                                    {repost?.user?.handle}
                                </h4>
                                {repost.body}
                            </div>
                        ) : (
                            <p>Post could not be loaded</p>
                        )}
                    </div>
                }

                <div 
                    className={` ${ hasHashtags ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 py-2`}
                >
                    <div className="overflow-hidden flex items-center flex-wrap gap-2">

                        {hasHashtags &&
                            <span className="font-bold">Hashtags:</span>
                        }

                        {hashtags.map( (tag, index) => (
                            <span className="px-3 py-1 border rounded-lg" key={index}>
                                {tag}
                            </span>
                        ))}

                    </div>
                </div>        

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


    const appContext                                  = useContext(AppContext)
    const [deleteBtnText, setDeleteBtnText]           = useState<string>('Delete')
    const [hasConfirmedDelete, setHasConfirmedDelete] = useState<boolean>(false)
    const [hasDeleted, setHasDeleted]                 = useState<boolean>(false)


    async function handleFormSubmit() : Promise<void> {
        const res = await updatePostBody(postId as string, postBody as string)
        
        if( res.success) {
            setTimeout( () => appContext?.closeModal(), REDIRECT_TIME)
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
            setTimeout( () => appContext?.closeModal(), REDIRECT_TIME)
        }
    }


    useEffect( () => {
        resetDeleteBtn()
    }, [postBody])

    
    function resetDeleteBtn() {
        setDeleteBtnText('Delete')
        setHasConfirmedDelete(false)
    }

    
    return { handleFormSubmit, appContext, handleDelete, deleteBtnText, hasDeleted }
}