import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getPost } from "../../services/PostService"
import { PostCardProps } from "../PostCard"
import Repost from "./Repost"
import PostCardHeader from "./PostCardHeader"
import PostCardActions from "./PostCardActions"
import { Post } from "../../utils/types"
import { hashtagRegex } from "../../utils/hashtags"
import reactStringReplace from "react-string-replace"



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
    

    const bodyWithHashtags = reactStringReplace(post?.body, hashtagRegex, (match, index) => {

        return (
            <Link 
                to={`/tag/${match.replace('#', '')}`} 
                className="text-rose-500 hover:underline" 
                key={index}
            >
                {match}
            </Link>
        )
    })
    

    return (
        <div className="p-[2px] rounded-xl bg-gradient-to-br from-blue-200 via-rose-200 to-blue-200 shadow-lg shadow-blue-50">
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-white">
                <PostCardHeader post={post as Post} isLoaded={isLoaded} />

                <div className="mt-2">
                    {bodyWithHashtags}
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
                        className="block bg-blue-100 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
                    >
                        View Post
                    </Link>
                }

                <PostCardActions post={post as Post} />
            </div>
        </div>
    )
}






