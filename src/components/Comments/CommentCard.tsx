import { useContext } from "react"
import { auth } from "../../../firebase-config"
import { PostComment, User } from "../../utils/types"
import Avatar from "../Avatar"
import Button from "../Button"
import { AppContext } from "../../App"
import EditComment from "../../modals/EditComment"
import Icon from "../Icon"
import { Link } from "react-router-dom"

interface CommentCardProps {
    comment: PostComment,
    user   : User | null
}

export default function CommentCard({ comment, user }: CommentCardProps) {


    const appContext = useContext(AppContext)

    
    return (
        <div className="grid grid-cols-[50px_1fr] gap-6 pb-6 border-b-4 border-blue-50">

            <div className="relative pt-2">
                <div className="absolute top-2 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-blue-200 rounded-full"></div>
                <Avatar src={user?.avatar} />
            </div>

            <div>
                <h3 className="flex justify-between items-center my-2 font-bold text-blue-900">
                    <Link to={`/profile/${comment.userId}`} className="py-1 hover:underline">
                        {user?.handle}
                    </Link>

                    { comment.userId === auth.currentUser?.uid && (
                        <Button
                            className="p-1 hover:bg-blue-100 text-blue-400"
                            onClick={ () => appContext?.setModal(<EditComment comment={comment} />) }
                        >
                            Edit
                            <Icon icon="edit_note" />
                        </Button>
                    )}
                </h3>

                <p>
                    {comment.comment}
                </p>

            </div>

        </div>
    )
}
