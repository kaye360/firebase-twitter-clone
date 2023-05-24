import { useNavigate, useParams } from "react-router-dom"
import useGetSinglePost from "../hooks/useGetSinglePost"
import PostCard from "../components/PostCard"
import Icon from "../components/Icon"

export default function SinglePost() {

    const { id: postId } = useParams()

    const { post, isLoaded } = useGetSinglePost(postId as string)

    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-4 items-start">
            <h2 className="flex items-stretch gap-4 ">
                <button onClick={() => navigate(-1)}>
                    <Icon icon="arrow_back" />
                </button>

                <div className="mt-[1px]">
                    Single Post
                </div>
            </h2>

            <PostCard post={post} isLoaded={isLoaded} isShowingViewPostBtn={false} />

            <div>
                Comments
            </div>
        </div>
    )
}





