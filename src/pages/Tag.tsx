import { useParams } from "react-router-dom"
import useGetPosts from "../hooks/useGetPosts"
import PostList from "../components/PostList"
import { Post } from "../utils/types"
import { SearchBar } from "../components/SearchBar"

export default function Tag() {

    const { tag } = useParams()

    const posts = useGetPosts({ tag : `#${tag?.toLowerCase()}` }) as Post[]

    return (
        <div className="grid gap-6">
            <h1>
                Tag: #{tag}
            </h1>

            <SearchBar defaultSearchPhrase={tag} />

            <PostList posts={posts as Post[]} />

        </div>
    )
}




