import { useParams } from "react-router-dom"
import useGetPosts from "../hooks/useGetPosts"
import PostList from "../components/PostList"
import { Post } from "../utils/types"

export default function Tag() {

    const { tag } = useParams()

    const posts = useGetPosts({ tag : `#${tag}` })

    return (
        <div>
            <h1>
                Tag: #{tag}
            </h1>

            <PostList posts={posts as Post[]} />

        </div>
    )
}
