import { SyntheticEvent } from "react"


interface AvatarProps {
    src? : string
}

export default function Avatar({src} : AvatarProps) {

    function removeImg(e : SyntheticEvent) {
        if( e.target instanceof Element) {
            e.target.remove()
        }
    }

    return (
        <div className="rounded-full w-12 h-12 bg-slate-300 overflow-hidden">
            { src && 
                <img
                    src={src}
                    onError={removeImg}
                    className="w-full aspect-square object-cover"
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                />
            }
        </div>
    )
}
