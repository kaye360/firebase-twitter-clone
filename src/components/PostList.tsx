import useGetPosts from "../hooks/useGetPosts"
import { Post } from "../services/PostService"
import PostCard from "./PostCard"


export default function PostList() {

    const posts: Post[] | null = useGetPosts()
    
    return (
        <>
            { posts?.map(post => (
                <PostCard post={post} isLoaded={true} key={post.id} />
            ))}
        </>
    )
}
