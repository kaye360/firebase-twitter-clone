import { UseGetPosts } from "../hooks/useGetPosts"
import Button from "./Button"
import Icon from "./Icon"
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

            { posts.posts.length >= posts.totalPosts ? (
                <div className="text-lg">
                    There are no posts to show.
                </div>
            ) : (
                <Button 
                    onClick={ () => posts.gotoNextPage() }
                    className="w-full border border-blue-200"
                >
                    Load More Posts
                    <Icon icon="expand_more" className="ml-auto" />
                </Button>
            )}
        </div>
    )
}
