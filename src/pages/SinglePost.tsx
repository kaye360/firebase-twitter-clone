import { useParams } from "react-router-dom"
import useGetSinglePost from "../hooks/useGetSinglePost"
import PostCard from "../components/PostCard"

export default function SinglePost() {

    const { id: postId } = useParams()

    const { post, isLoaded } = useGetSinglePost(postId as string)

    return (
        <div className="flex flex-col gap-4 items-start">
            <h2>Single Post</h2>

            <PostCard post={post} isLoaded={isLoaded} isShowingViewPostBtn={false} />

            <div>
                Comments
            </div>
        </div>
    )
}





