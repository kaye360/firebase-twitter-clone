import { Link } from "react-router-dom";
import { toggleLikePost } from "../../../services/PostService";
import { useContext } from "react";
import { Post } from "../../../utils/types";
import ViewPostLikes from "../../../modals/ViewPostLikes";
import CreatePost from "../../../modals/CreatePost";
import Button from "../../Layout/Button";
import Icon from "../../Layout/Icon";
import useUser from "../../../hooks/useUser";
import { ModalContext } from "../../../App";

interface PostCardActionsProps {
    post : Post
}

export default function PostCardActions({post} : PostCardActionsProps) {

    const { 
        toggleLike, 
        isLikedByCurrentUser, 
        handleViewLikes, 
        totalLikes, 
        handleRepost 
    } = usePostCardActions({post})    

    
    return (
        <div className="flex items-center gap-2 w-1/2 text-blue-400 text-base">

            <div className="flex items-center gap-0">
                <Button onClick={toggleLike} className="px-[3px]">
                    <Icon icon="favorite" className={` ${isLikedByCurrentUser ? 'text-rose-400' : ''} hover:text-fuchsia-400 `} />
                </Button>

                <Button onClick={handleViewLikes} className="px-[3px] hover:underline">
                    {totalLikes}
                </Button>
            </div>

            <Button>
                <Link to={`/post/${post?.id}#comments`} className="translate-y-[3px]">
                    <Icon icon="chat_bubble" />
                </Link>
                <span>
                    {post?.comments?.length || 0}
                </span>
            </Button>

            <Button onClick={handleRepost} >
                <Icon icon="sync" />
                <span>{post?.reposts}</span>
            </Button>

        </div>
    )
}





function usePostCardActions({post} : PostCardActionsProps) {

    const modal = useContext(ModalContext)
    const user  = useUser()

    let isLikedByCurrentUser : boolean = 
        Array.isArray( post?.likes ) && typeof user.id === 'string' ? (
            post?.likes?.includes(user.id)
        ) : (
            false
        )


    const totalLikes : number = post && Array.isArray(post?.likes) ? post?.likes.length : 0


    async function toggleLike() {
        if( !(
            typeof post.id === 'string' &&
            typeof user.id === 'string' && 
            typeof user.handle ==='string'
        ) ) return

        toggleLikePost({
            postId     : post?.id,
            userId     : user.id,
            userHandle : user.handle
        })
    }


    function handleRepost() {
        modal.set(
            <CreatePost 
                repostId={post?.id} 
                targetUserId={post.userId}
            />
        )
    }


    function handleViewLikes() {
        modal.set(<ViewPostLikes likes={post.likes} />)
    }

    
    return { toggleLike, isLikedByCurrentUser, handleViewLikes, totalLikes, handleRepost }
}