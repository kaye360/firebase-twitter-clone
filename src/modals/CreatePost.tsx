import { useContext, useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { auth } from "../../firebase-config";
import { AppContext } from "../App";
import { createPost } from "../services/PostService";
import Avatar from "../components/Avatar";
import { redirectTime } from "../utils/appConfig";
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm";
import ValidatedTextarea from "../components/ValidatedForm/components/ValidatedTextarea";
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage";
import SubmitSuccessMessage from "../components/ValidatedForm/components/SubmitSuccessMessage";
import useLoadRepost from "../hooks/useLoadRepost";
import useExtractHashtags from "../hooks/useExtractHashtags";


interface CreatePostProps {
    repostId?     : string | null,
    targetUserId? : string | null,
}

export default function CreatePost({targetUserId = null, repostId = null} : CreatePostProps) {

    // Textarea value state
    const [postBody, setPostBody] = useState<string>('')


    // Form onSubmit handling logic
    const { appContext, handleFormSubmit } = useCreatePost({postBody, targetUserId, repostId})


    // Load repost if repostId is given
    const { repost } = useLoadRepost({repostId})


    // Extract hashtags logic
    const { hashtags, hasHashtags } = useExtractHashtags({string : postBody})


    if( !auth.currentUser ) {
        return(
            <div className="flex items-center gap-2">
                <Icon icon="info" />
                You must be logged in to post.
            </div>
        )
    }

    return (
        <ValidatedForm 
            handleSubmit={ handleFormSubmit } 
            config={{successMessage : 'Post created successfully'}}
            rules={{auth : true}}
            id="create-post-form" // For dev use. Used to insert dummy text
        >
            <div className="flex flex-col gap-4">
                <h2>Create a Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="create-post-postBody">Posting as {appContext?.userHandle}</label>
                    <span className={postBody.length > 200 ? 'text-red-400 font-bold' : ''}>
                        {postBody.length} / 200
                    </span>
                </div>

                <ValidatedTextarea 
                    title="Post"    
                    value={postBody}
                    setValue={setPostBody}
                    rules={{
                        required  : true,
                        maxLength : 200,
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

                <div className="flex items-center gap-4">
                    <Button type="submit" className="bg-blue-200 hover:bg-rose-200">
                        Create
                    </Button>

                    <SubmitErrorMessage />
                    <SubmitSuccessMessage />

                </div>

                {/* For development and testing 

                    The dispatchEvent is needed to trigger an onChange event, which
                    then triggers the useEffect hook */}
                <Button onClick={(e) => { 
                    e.preventDefault() 
                    setPostBody('Lorem ipsum #dolor sit amet consectetur #adipisicing elit. Asperiores aliquid #illum dicta excepturi labore, hic #cupiditate consequatur qui eius obcaecati aperiam necessitatibus pariatur expedita.')
                    document.getElementById('create-post-form')?.dispatchEvent(new Event('change'))
                 }}>
                    Insert dummy text
                </Button>

            </div>
        </ValidatedForm>
    )
}




interface UseCreatePostProps extends CreatePostProps {
    postBody : string,
}

function useCreatePost({postBody, targetUserId =  null, repostId = null} : UseCreatePostProps) {


    const appContext = useContext(AppContext)
    const navigate   = useNavigate()


    async function handleFormSubmit() {

        const res = await createPost({
            body: postBody,
            repostId,
            targetUserId,
            userHandle : appContext?.userHandle as string,
        })

        if( res.success && res.content) exitModal({to : '/post/' + res.content})
    }


    function exitModal({to} : {to : string}) {
        setTimeout( () => {
            appContext?.closeModal()
            navigate(to)
        }, redirectTime)
    }


    return { appContext, handleFormSubmit }

}
