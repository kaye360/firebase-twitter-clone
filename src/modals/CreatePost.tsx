import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { AppContext } from "../App";
import { createPost } from "../services/PostService";
import { MAX_POST_LENGTH, REDIRECT_TIME } from "../utils/appConfig";
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm";
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage";
import SubmitSuccessMessage from "../components/ValidatedForm/components/SubmitSuccessMessage";
import useLoadRepost from "../hooks/useLoadRepost";
import useExtractHashtags from "../hooks/useExtractHashtags";
import ValidatedField from "../components/ValidatedForm/components/ValidatedField";
import RepostPreview from "../components/Posts/RepostPreview";
import HashtagsPreview from "../components/Posts/HashtagsPreview";
import Button from "../components/Layout/Button";
import Icon from "../components/Layout/Icon";


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
            <div className="grid gap-4">

                <h2>Create a Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="postBody">Posting as {appContext?.userHandle}</label>
                    <span className={postBody.length > MAX_POST_LENGTH ? 'text-red-400 font-bold' : ''}>
                        {postBody.length} / {MAX_POST_LENGTH}
                    </span>
                </div>

                <ValidatedField
                    type="textarea"
                    id="postBody"
                    title="Post"    
                    value={postBody}
                    setValue={setPostBody}
                    rules={{
                        required  : true,
                        maxLength : MAX_POST_LENGTH,
                    }}
                />

                { repostId && <RepostPreview repost={repost} /> }

                <HashtagsPreview hashtags={hashtags} hasHashtags={hasHashtags} />

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
                    document.getElementById('postBody')?.dispatchEvent(new KeyboardEvent('change'))
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
        }, REDIRECT_TIME)
    }


    return { appContext, handleFormSubmit }

}
