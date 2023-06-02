import { Link } from "react-router-dom";
import Button from "../Button";
import Icon from "../Icon";
import { toggleLikePost } from "../../services/PostService";
import { useContext } from "react";
import { AppContext } from "../../App";
import CreatePost from "../../modals/CreatePost";
import { Post } from "../../utils/types";

interface PostCardActionsProps {
    post : Post
}

export default function PostCardActions({post} : PostCardActionsProps) {

    
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

        if( typeof post?.id !== 'string' ) return
            
        appContext?.setModal(
            <CreatePost repostId={post?.id} closeModal={appContext.closeModal} />
        )
    }


    
    return (
        <div className="flex items-center gap-2 w-1/2 text-sky-400 text-base">

            <Button onClick={toggleLike}>
                <Icon icon="favorite" className={isLikedByCurrentUser ? 'text-rose-400' : ''} />
                <span>
                    {totalLikes}
                </span>
            </Button>

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
