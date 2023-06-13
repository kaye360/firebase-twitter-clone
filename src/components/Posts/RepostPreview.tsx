import { Post } from "../../utils/types";
import Avatar from "../Layout/Avatar";



export default function RepostPreview({repost} : {repost : Post | null}) {
    return (
        <div className="bg-blue-100 border border-blue-200 w-full rounded-lg p-4">
            <h3 className="font-bold mb-4 border-b border-slate-300">Reposting:</h3>

            {repost ? (
                <div>
                    <h4 className="flex items-center gap-2 mb-2 font-bold text-blue-700">
                        <Avatar src={repost.user?.avatar} className="w-8 h-8" />
                        {repost?.user?.handle}
                    </h4>
                    {repost.body}
                </div>
            ) : (
                <p>Post could not be loaded</p>
            )}
        </div>
    )
}
