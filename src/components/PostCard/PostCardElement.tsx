import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import EditPost from "../../modals/EditPost"
import { toggleLikePost } from "../../services/PostService"
import Avatar from "../Avatar"
import Icon from "../Icon"
import { PostCardProps } from "../PostCard"



export default function PostCardElement({ post, isLoaded, isShowingViewPostBtn }: PostCardProps) {

    if (isLoaded && !post?.body && !post?.date && !post?.userId) {
        throw 'Error getting post.'
    }

    const appContext     = useContext(AppContext)
    const loggedInUserId = appContext?.firebaseAuth?.uid

    let isLikedByCurrentUser : boolean = 
        Array.isArray( post?.likes ) && typeof appContext?.firebaseAuth?.uid === 'string' ? (
            post?.likes?.includes(appContext?.firebaseAuth?.uid) as boolean
        ) : (
            false
        )

    const totalLikes : number = post && Array.isArray(post?.likes) ? post?.likes.length : 0

    function openEditModal() {
        appContext?.setModal(
            <EditPost postId={post?.id} closeModal={appContext.closeModal} />
        )
    }


    async function toggleLike() {
        toggleLikePost({
            postId: post?.id as string,
            userId : appContext?.firebaseAuth?.uid as string
        })
    }

    return (
        <div className="flex flex-col gap-4 w-full border-2 border-sky-50 p-6 rounded-xl shadow-md shadow-sky-50">

            <div className="flex justify-between">

                <div className="flex items-center gap-2">

                    <Link to={`/profile/${post?.userId}`}>
                        <Avatar src={post?.user?.avatar} />
                    </Link>

                    <Link 
                        to={`/profile/${post?.userId}`}
                        className="inline-block px-2 text-md font-semibold bg-teal-50 hover:bg-orange-100 rounded-lg"
                    >
                        @{post?.user?.handle || '[deleted]' }
                    </Link>

                    <span className="text-sm">
                        {post?.date?.toDate().toDateString()}
                    </span>
                </div>

                {loggedInUserId === post?.userId &&
                    <button onClick={openEditModal}>
                        <Icon icon="more_vert" className="text-sky-500 hover:text-orange-500" />
                    </button>
                }

            </div>

            <div className="mt-2 my-4">{post?.body}</div>

            {isShowingViewPostBtn &&
                <Link 
                    to={`/post/${post?.id}`} 
                    className="block bg-sky-50 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
                >
                    View Post
                </Link>
            }

            <div className="flex items-start gap-2 w-1/2 text-sky-400 text-base">
                
                <button onClick={ toggleLike }>
                    <Icon icon="favorite" className={isLikedByCurrentUser ? 'text-rose-400' : ''} />
                </button>

                <span className="mr-6">
                    {totalLikes}
                </span>

                <Icon icon="chat_bubble" className="" />
                <span className="mr-6">
                    {Math.floor(Math.random() * (99-1 + 1) + 1 )}
                </span>

                <Icon icon="sync" className="" />
                <span className="mr-6">
                    {Math.floor(Math.random() * (99-1 + 1) + 1 )}
                </span>

            </div>

        </div>
    )
}







export interface SinglePostErrorProps {
    error: string
}

export function SinglePostError({ error } : SinglePostErrorProps): JSX.Element {

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



