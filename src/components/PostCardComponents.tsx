import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../App"
import EditPost from "../modals/EditPost"
import { PostCardProps } from "./PostCard"
import Avatar from "./Avatar"





export default function PostCardElement({ post, isLoaded, isShowingViewPostBtn }: PostCardProps) {

    if (isLoaded && !post?.body && !post?.date && !post?.userId) {
        throw 'Error getting post.'
    }

    const appContext = useContext(AppContext)
    const loggedInUserId = appContext?.firebaseAuth?.uid


    function openEditModal() {
        appContext?.setModal(
            <EditPost postId={post?.id} closeModal={appContext.closeModal} />
        )
    }

    return (
        <div className="flex flex-col gap-2 w-full bg-sky-50 p-4 rounded-xl">

            <div className="flex justify-between">

                <div className="flex items-center gap-2">
                    <Avatar src={post?.user?.avatar} />
                    {post?.user?.handle || '[deleted]' }
                </div>

                {loggedInUserId === post?.userId &&
                    <button onClick={openEditModal}>
                        Edit
                    </button>
                }

            </div>

            <div className="flex justify-between">
                {post?.date?.seconds}
            </div>

            <div>{post?.body}</div>

            {isShowingViewPostBtn &&
                <div className="bg-sky-100 p-2 rounded-lg text-sm">
                    <Link to={`/post/${post?.id}`}>View Post</Link>
                </div>
            }

        </div>
    )
}







export interface SinglePostErrorProps {
    error: string
}

export function SinglePostError({ error }: SinglePostErrorProps): JSX.Element {

    const navigate = useNavigate()

    return (
        <div role="alert" className="flex flex-col items-start gap-4 p-4 bg-rose-50 rounded-lg">

            <p className="font-bold">
                {error}
            </p>

            <p>
                This post may have been deleted. Otherwise, please try again later.
            </p>

            <button onClick={() => navigate(-1)} className="underline">
                Go Back
            </button>

        </div>
    )
}




export function PostCardLoader() {
    return (
        <div className="flex flex-col gap-2 w-full bg-sky-50 p-4 rounded-xl animate-pulse">

            <div className="flex justify-between">

                <div className="flex items-center gap-2 w-1/2">
                    <span className="block rounded-full h-8 w-8 bg-sky-100"></span>
                    <span className='block rounded-lg h-6 w-full bg-sky-100'></span>
                </div>

                <div className='bg-sky-100 w-16 h-8 rounded-lg'></div>

            </div>

            <span className='block mb-4 rounded-lg h-4 w-1/3 bg-sky-100'></span>

            <span className='block rounded-lg h-4 w-full bg-sky-100'></span>
            <span className='block rounded-lg h-4 w-full bg-sky-100'></span>
            <span className='block rounded-lg h-4 w-2/3 bg-sky-100'></span>

            <span className='block mt-8 rounded-lg h-4 w-full bg-sky-100'></span>

        </div>
    )
}
