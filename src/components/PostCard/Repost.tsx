import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import { Post } from "../../services/PostService";


interface RepostProps {
    post   : Post,
    repost : Post
}

export default function Repost({post, repost} : RepostProps) {
    return (
        <div className="flex flex-col gap-2 border-2 border-sky-100 p-4 rounded-lg">

            <h3 className="flex items-center gap-2 font-bold mb-2">
                <Avatar src={repost.user?.avatar} className="w-8 h-8" />
                <span>
                    @{repost.user?.handle}
                </span>
            </h3>

            <p>
                {repost.body}
            </p>

            <Link
                to={`/post/${post?.repostId}`}
                relative="path"
                className="block bg-sky-50 hover:bg-orange-50 px-2 py-1 rounded-lg text-sm text-center"
            >
                <span>View Post</span>
            </Link>
        </div>
    )
}
