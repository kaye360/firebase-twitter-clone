import { useState, useEffect } from "react"
import { getPost } from "../services/PostService"
import { Post } from "../utils/types"



interface UseLoadRepostProps {
    repostId : string,
}

interface UseLoadRepost {
    repost : Post | null,
}

export default function useLoadRepost({repostId} : UseLoadRepostProps) : UseLoadRepost {
    

    const [repost, setRepost] = useState<Post | null>(null)


    useEffect( () => {
        ( async function loadRepost() {
            if( !repostId ) return
            const loadRepost = await getPost(repostId)
            setRepost(loadRepost)
        })()
    }, [])
    
    return { repost }
}
