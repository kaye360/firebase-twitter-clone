import { SyntheticEvent, useState, useContext, useEffect } from "react"
import { createPost, createRepost, getPost } from "../services/PostService"
import { redirectTime } from "../utils/appConfig"
import { AppContext } from "../App"
import Icon from "../components/Icon"
import { useNavigate } from "react-router-dom"
import Avatar from "../components/Avatar"
import { Post, ResponseSuccess } from "../utils/types"


interface CreatePostProps {
    closeModal    : Function,
    repostId?     : string | null
    targetUserId? : string
}

export default function CreatePost({closeModal, targetUserId, repostId = null} : CreatePostProps) {


    const appContext = useContext(AppContext)
    const navigate   = useNavigate()
    const lorem      = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores aliquid illum dicta excepturi labore amet, hic cupiditate consequatur qui eius obcaecati aperiam necessitatibus pariatur expedita.'


    if( !appContext?.firebaseAuth ) {
        return(
            <div className="flex items-center gap-2">
                <Icon icon="info" />
                You must be logged in to post.
            </div>
        )
    }


    const [body, setBody]       = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [repost, setRepost]   = useState<Post | null>(null)


    async function handleCreatePost(e: SyntheticEvent) {
        e.preventDefault()

        if( body.length > 200 ) {
            setMessage('Post must be 200 characters or less')
            return 
        } 

        if( body.length === 0 && !repost ) {
            setMessage('Please enter a post')
            return
        }
        
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
                closeModal()
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

                <div className="flex items-center gap-4">
                    <button className="bg-sky-200 hover:bg-rose-200 px-8 py-4 rounded-lg">
                        Create
                    </button>

                    <button onClick={(e) => { e.preventDefault(); setBody(lorem) }}>
                        Lorem
                    </button>

                    {message}
                </div>
            </div>
        </form>
    )
}
