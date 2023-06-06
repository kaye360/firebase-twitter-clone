import { useParams } from "react-router-dom"
import useGetPosts from "../hooks/useGetPosts"
import PostList from "../components/PostList"
import { SearchBar } from "../components/SearchBar"
import { useEffect, useState } from "react"

export default function Tag() {

    const { tag } = useParams()

    const [currentTag, setCurrentTag] = useState<string | undefined>(tag)

    useEffect( () => {
        console.log('clikc')
        setCurrentTag(tag)
    }, [tag])

    const posts = useGetPosts({ tag : `#${tag?.toLowerCase()}` })

    return (
        <div className="grid gap-6">
            <h1>
                Tag: #{currentTag}
            </h1>

            <SearchBar defaultSearchPhrase={currentTag} />

            <PostList posts={posts} />

        </div>
    )
}




