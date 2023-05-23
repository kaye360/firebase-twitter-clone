import { SyntheticEvent, useState, useContext } from "react"
import { createPost } from "../services/PostService"
import { redirectTime } from "../utils/appConfig"
import { AppContext } from "../App"


interface CreatePostProps {
    closeModal : Function
}

export default function CreatePost({closeModal} : CreatePostProps) {

    const appContext = useContext(AppContext)

    if( !appContext?.firebaseAuth ) {
        return(
            <div>
                You must be logged in to post.
            </div>
        )
    }

    const [body, setBody] = useState<string>('')
    const [message, setMessage] = useState<string>('')


    async function handleCreatePost(e: SyntheticEvent) {
        e.preventDefault()
        const res = await createPost(body)
        setMessage(res.message)
        
        if( res.success && res.content) {
            setTimeout( () => {
                closeModal()
            }, redirectTime)
        }
    }

    return (
        <form method="get" onSubmit={handleCreatePost}>
            <div className="flex flex-col gap-4 items-start">
                <h2>Create a Post</h2>

                <p>Posting as {appContext.userHandle}</p>

                <textarea 
                    onChange={(e) => setBody(e.target.value)}
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

                <div className="flex items-center gap-4">
                    <button className="bg-sky-200 hover:bg-rose-200 px-8 py-4 rounded-lg">
                        Create
                    </button>

                    {message}
                </div>
            </div>
        </form>
    )
}
