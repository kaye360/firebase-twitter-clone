import { SyntheticEvent, useState, useContext, useEffect } from "react"
import { createPost, createRepost, getPost } from "../services/PostService"
import { redirectTime } from "../utils/appConfig"
import { AppContext } from "../App"
import Icon from "../components/Icon"
import { useNavigate } from "react-router-dom"
import Avatar from "../components/Avatar"
import { Post, ResponseSuccess } from "../utils/types"
import { extractHashtags } from "../utils/hashtags"
import Button from "../components/Button"


interface CreatePostProps {
    repostId?     : string | null
    targetUserId? : string
}

export default function CreatePost({targetUserId, repostId = null} : CreatePostProps) {


    const appContext = useContext(AppContext)
    const navigate   = useNavigate()


    if( !appContext?.firebaseAuth ) {
        return(
            <div className="flex items-center gap-2">
                <Icon icon="info" />
                You must be logged in to post.
            </div>
        )
    }

    const [body, setBody]         = useState<string>('')
    const [message, setMessage]   = useState<string>('')
    const [repost, setRepost]     = useState<Post | null>(null)
    const [hashtags, setHashtags] = useState<string[]>([])
    const hasHashtags             = hashtags.length !== 0


    async function handleCreatePost(e: SyntheticEvent) {
        e.preventDefault()
        
        let res: ResponseSuccess
        
        if( repost && repostId ) {
            res = await createRepost({
                body,
                repostId,
                targetUserId : targetUserId as string,
                userHandle   : appContext?.userHandle as string,
            })

        } else {
            res = await createPost(body)
        }

        setMessage(res.message)
        
        if( res.success && res.content) {
            setTimeout( () => {
                appContext?.closeModal()
                navigate('/post/' + res.content)
            }, redirectTime)
        }
    }


    useEffect( () => {
        ( async function loadRepost() {
            if( !repostId ) return
            const loadRepost = await getPost(repostId)
            setRepost(loadRepost)
        })()
    }, [])


    useEffect( () => {
        const newHashtags = extractHashtags({body})
        setHashtags(newHashtags || [])
    }, [body])
    

    return (
        <form method="get" onSubmit={handleCreatePost}>
            <div className="flex flex-col gap-4">
                <h2>Create a Post</h2>

                <div className="flex justify-between">
                    <label htmlFor="create-post-body">Posting as {appContext.userHandle}</label>
                    <span className={body.length > 200 ? 'text-red-400 font-bold' : ''}>
                        {body.length} / 200
                    </span>
                </div>

                <textarea
                    id="create-post-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

                { repostId && 
                    <div className="bg-sky-100 border border-sky-200 w-full rounded-lg p-4">
                        <h3 className="font-bold mb-4 border-b border-slate-300">Reposting:</h3>

                        { repost ? (
                            <div>
                                <h4 className="flex items-center gap-2 mb-2 font-bold text-sky-700">
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
                    <Button className="bg-sky-200 hover:bg-rose-200">
                        Create
                    </Button>

                    {/* For development and testing */}
                    <button onClick={(e) => { e.preventDefault(); setBody('Lorem ipsum #dolor sit amet consectetur #adipisicing elit. Asperiores aliquid #illum dicta excepturi labore, hic #cupiditate consequatur qui eius obcaecati aperiam necessitatibus pariatur expedita.') }}>
                        Insert dummy text
                    </button>

                    {message}
                </div>
            </div>
        </form>
    )
}
