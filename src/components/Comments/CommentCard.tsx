import { PostComment, User } from "../../utils/types"
import Avatar from "../Avatar"

interface CommentCardProps {
    comment: PostComment,
    user   : User | null
}

export default function CommentCard({ comment, user }: CommentCardProps) {
    
    return (
        <div className="grid grid-cols-[50px_1fr] gap-6 pb-6 border-b-4 border-blue-50">

            <div className="relative">
                <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-blue-200 rounded-full"></div>
                <Avatar src={user?.avatar} />
            </div>

            <div>
                <h3 className="my-2 font-bold text-blue-900">
                    {user?.handle}
                </h3>

                <p>
                    {comment.comment}
                </p>

                <button className="text-left">
                    {comment.commentId}<br />
                    {comment.postId},
                </button>
            </div>

        </div>
    )
}
