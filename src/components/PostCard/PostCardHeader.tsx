import { Link } from 'react-router-dom'
import Avatar from '../Avatar'
import Icon from '../Icon'
import { Post } from '../../services/PostService'
import { useContext } from 'react'
import { AppContext } from '../../App'
import EditPost from '../../modals/EditPost'

interface PostCardHeaderProps {
    post : Post,
}

export default function PostCardHeader({post} : PostCardHeaderProps) {


    const appContext     = useContext(AppContext)
    const loggedInUserId = appContext?.firebaseAuth?.uid


    function openEditModal() {
        appContext?.setModal(
            <EditPost postId={post?.id} closeModal={appContext.closeModal} />
        )
    }

    

    return (
        <div className="flex justify-between">

            <div className="flex items-center gap-2">

                <Link to={`/profile/${post?.userId}`}>
                    <Avatar src={post?.user?.avatar} />
                </Link>

                <Link
                    to={`/profile/${post?.userId}`}
                    className="inline-block px-2 text-md font-semibold bg-teal-50 hover:bg-orange-100 rounded-lg"
                >
                    @{post?.user?.handle}
                </Link>

                <span className="text-sm">
                    {post?.date?.toDate().toDateString()}
                </span>
            </div>

            {loggedInUserId === post?.userId &&
                <button onClick={openEditModal}>
                    <Icon icon="more_vert" className="text-sky-500 hover:text-orange-500" />
                </button>
            }

        </div>
    )
}
