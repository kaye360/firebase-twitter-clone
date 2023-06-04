import { Post } from "../utils/types"
import PostCard from "./PostCard"



export default function PostList({posts} : {posts: Post[]}) {

    return (
        <>
            { posts?.map(post => (
                <PostCard post={post} isLoaded={true} key={post.id} />
            ))}

            { posts?.length === 0 &&
                <div className="text-lg">
                    There are no posts to show.
                </div>
            }
        </>
    )
}
