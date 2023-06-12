import { useState, useEffect } from "react"
import { extractHashtags } from "../utils/hashtags"



export default function useExtractHashtags({string} : {string : string}) {

    const [hashtags, setHashtags]         = useState<string[]>([])
    const hasHashtags                     = hashtags.length !== 0


    useEffect( () => {
        const newHashtags = extractHashtags({string})
        setHashtags(newHashtags || [])
    }, [string])

    return { hashtags, hasHashtags }
}
