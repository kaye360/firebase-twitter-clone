import { useParams } from "react-router-dom"
import useGetSinglePost from "../hooks/useGetSinglePost"
import PostCard from "../components/PostCard"
import CommentForm from "../components/Comments/CommentForm"
import CommentList from "../components/Comments/CommentList"
import { PostComment } from "../utils/types"
import BackBtn from "../components/BackBtn"

export default function SinglePost() {

    const { id: postId } = useParams()

    const { post, isLoaded } = useGetSinglePost(postId as string)



    return (
        <div className="flex flex-col gap-6 items-stretch">


            <BackBtn title="Single Post" />

            <PostCard post={post} isLoaded={isLoaded} isShowingViewPostBtn={false} />

            <CommentList comments={ post?.comments as PostComment[] } />

            <CommentForm postId={postId as string} targetUserId={post?.userId as string} />       

        </div>
    )
}



