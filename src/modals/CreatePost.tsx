import { SyntheticEvent, useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import ValidationError from "../components/Validation/ValidationError";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { auth } from "../../firebase-config";
import { AppContext } from "../App";
import { Post } from "../utils/types";
import { extractHashtags } from "../utils/hashtags";
import PostValidator from "../utils/validators/PostValidator";
import { createPost, getPost } from "../services/PostService";
import Avatar from "../components/Avatar";
import { redirectTime } from "../utils/appConfig";


interface CreatePostProps {
    repostId?     : string | null,
    targetUserId? : string | null,
}

export default function CreatePost({targetUserId = null, repostId = null} : CreatePostProps) {

    const { 
        appContext, 
        handleFormSubmit, 
        handleOnChange,
        body, 
        setBody, 
        repost, 
        hashtags, 
        hasHashtags, 
        formSubmitMessage,
        errorMessage,
    } = useCreatePost({targetUserId, repostId})


    if( !auth.currentUser ) {
        return(
            <div className="flex items-center gap-2">
                <Icon icon="info" />
                You must be logged in to post.
            </div>
        )
    }

    return (
        <form onSubmit={(e) => handleFormSubmit(e)}>
            <div className="flex flex-col gap-4">
                <h2>Create a Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="create-post-body">Posting as {appContext?.userHandle}</label>
                    <span className={body.length > 200 ? 'text-red-400 font-bold' : ''}>
                        {body.length} / 200
                    </span>
                </div>

                <ValidationError message={errorMessage} />

                <textarea
                    id="create-post-body"
                    value={body}
                    onChange={ handleOnChange}
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

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


                    {formSubmitMessage}
                </div>

                {/* For development and testing */}
                <Button onClick={(e) => { e.preventDefault(); setBody('Lorem ipsum #dolor sit amet consectetur #adipisicing elit. Asperiores aliquid #illum dicta excepturi labore, hic #cupiditate consequatur qui eius obcaecati aperiam necessitatibus pariatur expedita.') }}>
                    Insert dummy text
                </Button>

            </div>
        </form>
    )
}




function useCreatePost({targetUserId =  null, repostId = null} : CreatePostProps) {

    const appContext = useContext(AppContext)
    const navigate   = useNavigate()


    const [body, setBody]                 = useState<string>('')
    const [formSubmitMessage, setFormSubmitMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [repost, setRepost]             = useState<Post | null>(null)
    const [hasUserTyped, setHasUserTyped] = useState<boolean>(false)
    const [hashtags, setHashtags]         = useState<string[]>([])
    const hasHashtags                     = hashtags.length !== 0


    async function handleFormSubmit(e: SyntheticEvent) {
        e.preventDefault()
        
        try {
            PostValidator.onSubmit({postBody : body})
            setFormSubmitMessage('Posting...')
    
            const res = await createPost({
                body,
                repostId,
                targetUserId,
                userHandle : appContext?.userHandle as string,
            })
    
            setFormSubmitMessage(res.message)
            
            if( res.success && res.content) exitModal({to : '/post/' + res.content})
            

        } catch (error) {

            if( typeof error === 'string') {
                setFormSubmitMessage(error)
            }
        }
        
    }


    function handleOnChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLTextAreaElement)) return
        setBody(e.target.value)
        setHasUserTyped(true)
    }


    useEffect( () => {
        ( async function loadRepost() {
            if( !repostId ) return
            const loadRepost = await getPost(repostId)
            setRepost(loadRepost)
        })()
    }, [])


    useEffect( () => {
        if(!hasUserTyped) return 
        
        try {
            PostValidator.onChange({postBody : body})
            setErrorMessage('')
        } catch (error) {
            if( typeof error === 'string') {
                setErrorMessage(error)
            }
        }

        const newHashtags = extractHashtags({body})
        setHashtags(newHashtags || [])
    }, [body])


    function exitModal({to} : {to : string}) {
        setTimeout( () => {
            appContext?.closeModal()
            navigate(to)
        }, redirectTime)
    }


    return { appContext, handleOnChange, handleFormSubmit, body, setBody, repost, hashtags, hasHashtags, formSubmitMessage, errorMessage }

}
