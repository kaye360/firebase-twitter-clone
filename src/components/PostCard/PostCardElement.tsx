import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Post, getPost } from "../../services/PostService"
import { PostCardProps } from "../PostCard"
import Repost from "./Repost"
import PostCardHeader from "./PostCardHeader"
import PostCardActions from "./PostCardActions"



export default function PostCardElement({ post, isLoaded, isShowingViewPostBtn }: PostCardProps) {

    
    if (isLoaded && !post?.body && !post?.date && !post?.userId) {
        throw 'Error getting post.'
    }
    

    const [repost, setRepost] = useState<Post | null>(null)


    useEffect( () => {( async function loadRepost() {

        if( typeof post?.repostId === 'string' ) {
            const loadRepost = await getPost(post?.repostId) as Post
            setRepost(loadRepost)
        } else {
            setRepost(null)
        }

    })()}, [post])

    

    return (
        <div className="p-[2px] rounded-xl bg-gradient-to-br from-sky-200 via-rose-200 to-sky-200 shadow-lg shadow-sky-50">
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-white">
                <PostCardHeader post={post as Post} isLoaded={isLoaded} />

                <div className="mt-2">
                    {post?.body}
                </div>

                { repost && 
                    <Repost 
                        post={post as Post} 
                        repost={repost} 
                    />
                }

                {isShowingViewPostBtn &&
                    <Link 
                        to={`/post/${post?.id}`} 
                        className="block bg-sky-100 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
                    >
                        View Post
                    </Link>
                }

                <PostCardActions post={post as Post} />
            </div>
        </div>
    )
}






