import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AppContext } from "../../App"
import EditPost from "../../modals/EditPost"
import { Post, getPost, toggleLikePost } from "../../services/PostService"
import Avatar from "../Avatar"
import Icon from "../Icon"
import { PostCardProps } from "../PostCard"
import Button from "../Button"
import CreatePost from "../../modals/CreatePost"



export default function PostCardElement({ post, isLoaded, isShowingViewPostBtn }: PostCardProps) {

    
    if (isLoaded && !post?.body && !post?.date && !post?.userId) {
        throw 'Error getting post.'
    }
    
    const appContext          = useContext(AppContext)
    const loggedInUserId      = appContext?.firebaseAuth?.uid
    const [repost, setRepost] = useState<Post | null>(null)

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
            postId : post?.id as string,
            userId : appContext?.firebaseAuth?.uid as string
        })
    }


    function handleRepost() {

        if( typeof post?.id !== 'string' ) return
            
        appContext?.setModal(
            <CreatePost repostId={post?.id} closeModal={appContext.closeModal} />
        )
    }


    useEffect( () => {( async function loadRepost() {

        if( typeof post?.repostId === 'string' ) {
            const loadRepost = await getPost(post?.repostId) as Post
            setRepost(loadRepost)
        } else {
            setRepost(null)
        }

    })()}, [post])

    console.log(post)

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
                        @{ post?.user?.handle }
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

            <div className="mt-2">
                {post?.body}
            </div>

            { repost &&
                <div className="flex flex-col gap-2 border-2 border-sky-100 p-4 rounded-lg">

                    <h3 className="flex items-center gap-2 font-bold mb-2">
                        <Avatar src={repost.user?.avatar} className="w-8 h-8" />
                        <span>
                            @{repost.user?.handle}
                        </span>
                    </h3>

                    <p>
                        {repost.body}
                    </p>

                    <Link 
                        to={`/post/${post?.repostId}`} 
                        relative="path"
                        className="block bg-sky-50 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
                    >
                        <span>View Post</span>
                    </Link>
                </div>
            }

            {isShowingViewPostBtn &&
                <Link 
                    to={`/post/${post?.id}`} 
                    className="block bg-sky-100 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
                >
                    View Post
                </Link>
            }

            <div className="flex items-center gap-2 w-1/2 text-sky-400 text-base">
                
                <Button onClick={ toggleLike }>
                    <Icon icon="favorite" className={isLikedByCurrentUser ? 'text-rose-400' : ''} />
                    <span>
                        {totalLikes}
                    </span>
                </Button>

                <Button>
                    <Link to={`/post/${post?.id}#comments`} className="translate-y-[3px]">
                        <Icon icon="chat_bubble" />
                    </Link>
                    <span>
                        {post?.comments?.length || 0}
                    </span>
                </Button>

                <Button onClick={ handleRepost } >
                    <Icon icon="sync" />
                    <span>{post?.reposts}</span>
                </Button>

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



