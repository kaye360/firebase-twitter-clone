import useGetPosts, { UseGetPostsProps } from "../hooks/useGetPosts"
import { Post } from "../utils/types"
import PostCard from "./PostCard"



export default function PostList({userId} : UseGetPostsProps) {


    const posts: Post[] | null = useGetPosts({userId})

    
    return (
        <>
            { posts?.map(post => (
                <PostCard post={post} isLoaded={true} key={post.id} />
            ))}
        </>
    )
}
