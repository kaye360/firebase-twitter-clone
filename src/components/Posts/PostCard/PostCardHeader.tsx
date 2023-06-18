import { Link } from 'react-router-dom'
import Avatar from '../../Layout/Avatar'
import { useContext } from 'react'
import EditPost from '../../../modals/EditPost'
import { Post } from '../../../utils/types'
import Icon from '../../Layout/Icon'
import useUser from '../../../hooks/useUser'
import { ModalContext } from '../../../App'

interface PostCardHeaderProps {
    post     : Post,
    isLoaded : boolean
}

export default function PostCardHeader({post, isLoaded} : PostCardHeaderProps) {


    const modal      = useContext(ModalContext)
    const user       = useUser()
    const userHandle = isLoaded && post?.user?.handle ? post.user.handle : 'deleted'


    function openEditModal() {
        modal.set(
            <EditPost 
                postId={post?.id} 
                defaultPostBody={post.body} 
                repostId={post.repostId}
            />
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
                    @{ userHandle }
                </Link>

                <span className="text-sm">
                    {post?.date?.toDate().toDateString()}
                </span>
            </div>

            {user.id === post?.userId &&
                <button onClick={openEditModal}>
                    <Icon icon="more_vert" className="text-blue-500 hover:text-orange-500" />
                </button>
            }

        </div>
    )
}
