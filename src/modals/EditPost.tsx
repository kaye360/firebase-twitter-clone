import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { deletePost, getPost, updatePostBody } from "../services/PostService"
import { redirectTime } from "../utils/appConfig"
import { Post } from "../utils/types"
import { AppContext } from "../App"
import { extractHashtags } from "../utils/hashtags"
import Button from "../components/Button"


interface EditPostProps {
    postId     : string | undefined,
}

export default function EditPost({postId} : EditPostProps) {

    const appContext                                  = useContext(AppContext)
    const [_, setPost]                                = useState<Post | null>(null)
    const [body, setBody]                             = useState<string>('')
    const [message, setMessage]                       = useState<string>('')
    const [deleteBtnText, setDeleteBtnText]           = useState<string>('Delete')
    const [hasConfirmedDelete, setHasConfirmedDelete] = useState<boolean>(false)
    const [hashtags, setHashtags]                     = useState<string[]>([])
    const hasHashtags                                 = hashtags.length !== 0

    useEffect( () => {
        ( async function loadCurrentPost() {
            const currentPost = await getPost(postId)

            setPost(currentPost)

            if(currentPost) setBody(currentPost.body)
        })()
    },[])


    async function handleEditPost(e: SyntheticEvent) : Promise<void> {
        e.preventDefault()

        const res = await updatePostBody(postId as string, body)
        setMessage(res.message)
        
        if( res.success) {
            setTimeout( () => appContext?.closeModal(), redirectTime)
        }
    }


    function bodyOnChange(e : any) {
        setBody(e.target.value)
        resetForm()
    }


    async function handleDeletePost(id: string, e: SyntheticEvent) : Promise<void> {
        e.preventDefault()

        if(!hasConfirmedDelete) {
            setDeleteBtnText('Are you sure?')
            setHasConfirmedDelete(true)
            return
        }

        const res = await deletePost(id)
        setMessage(res.message)

        if(res.success) {
            setTimeout( () => appContext?.closeModal(), redirectTime)
        }
    }

    function resetForm() {
        setDeleteBtnText('Delete')
        setHasConfirmedDelete(false)
    }

    
    useEffect( () => {
        const newHashtags = extractHashtags({body})
        setHashtags(newHashtags || [])
    }, [body])
    

    return (
        <form method="get" onSubmit={handleEditPost}>
            <div className="flex flex-col gap-4 items-start">
                <h2>Edit a Post</h2>

                <textarea 
                    value={body}
                    onChange={bodyOnChange}
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

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

                <div className="flex items-center justify-between w-full gap-4">
                    <Button className="bg-sky-200 hover:bg-orange-200">
                        Save
                    </Button>

                    {message}

                    <Button 
                        className="bg-rose-100 hover:bg-orange-200"
                        onClick={ (e) => handleDeletePost(postId as string, e) }
                    >
                        {deleteBtnText}
                    </Button>
                </div>
            </div>
        </form>
    )
}
