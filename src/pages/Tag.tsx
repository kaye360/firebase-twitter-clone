import { useParams } from "react-router-dom"
import useGetPosts from "../hooks/useGetPosts"
import PostList from "../components/Posts/PostList"
import { useEffect, useState } from "react"
import BackBtn from "../components/Layout/BackBtn"
import { SearchBar } from "../components/Layout/SearchBar"

export default function Tag() {

    const { tag }                     = useParams()
    const posts                       = useGetPosts({ tag : `#${tag?.toLowerCase()}` })
    const [currentTag, setCurrentTag] = useState<string | undefined>(tag)


    useEffect( () => setCurrentTag(tag), [tag])


    return (
        <div className="grid gap-6">

            <BackBtn title="Back" />

            <h1>
                Tag: #{currentTag}
            </h1>


            <SearchBar defaultSearchPhrase={currentTag} />

            <PostList posts={posts} />

        </div>
    )
}




