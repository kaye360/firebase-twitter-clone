import { SyntheticEvent } from "react"


interface AvatarProps {
    src? : string
}

export default function Avatar({src} : AvatarProps) {

    console.log(src)

    return (
        <div className="rounded-full w-12 h-12 bg-slate-300 overflow-hidden">
            { src && 
                <img
                    src={src}
                    className="w-full aspect-square object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e : SyntheticEvent) => {  {
                        if( e.target instanceof Element) {
                            e.target.remove()
                        }
                    }}}
                />
            }
        </div>
    )
}
