import { UseGetPosts } from "../hooks/useGetPosts"
import Button from "./Button"
import PostCard from "./PostCard"


interface PostListProps {
    posts : UseGetPosts
}

export default function PostList({posts} : PostListProps) {

    return (
        <div className="grid gap-6">
            { posts.posts?.map(post => (
                <PostCard post={post} isLoaded={true} key={post.id} />
            ))}

            <Button onClick={ () => posts.gotoNextPage() }>
                Load More Posts
            </Button>

            { posts.posts?.length === 0 &&
                <div className="text-lg">
                    There are no posts to show.
                </div>
            }
        </div>
    )
}
