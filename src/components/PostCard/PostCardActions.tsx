import { Link } from "react-router-dom";
import Button from "../Button";
import Icon from "../Icon";
import { toggleLikePost } from "../../services/PostService";
import { useContext } from "react";
import { AppContext } from "../../App";
import { Post } from "../../utils/types";
import ViewPostLikes from "../../modals/ViewPostLikes";
import CreatePost from "../../modals/CreatePost";

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

    const appContext = useContext(AppContext)


    let isLikedByCurrentUser : boolean = 
        Array.isArray( post?.likes ) && typeof appContext?.firebaseAuth?.uid === 'string' ? (
            post?.likes?.includes(appContext?.firebaseAuth?.uid) as boolean
        ) : (
            false
        )


    const totalLikes : number = post && Array.isArray(post?.likes) ? post?.likes.length : 0


    async function toggleLike() {
        toggleLikePost({
            postId     : post?.id as string,
            userId     : appContext?.firebaseAuth?.uid as string,
            userHandle : appContext?.userHandle as string
        })
    }


    function handleRepost() {
        appContext?.setModal(
            <CreatePost 
                repostId={post?.id} 
                targetUserId={post.userId}
            />
        )
    }


    function handleViewLikes() {
        appContext?.setModal(<ViewPostLikes likes={post.likes} />)
    }

    
    return { toggleLike, isLikedByCurrentUser, handleViewLikes, totalLikes, handleRepost }
}