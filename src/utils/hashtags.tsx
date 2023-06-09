
export const hashtagRegex = /(#+[a-zA-Z0-9-]{1,})/g

interface ExtractHashtagsProps {
    body : string,
}

/**
 * @function extractHashtags
 * 
 * This function extracts hashtags from a text string and returns them as an array
 * All hashtags are stored as lowercase
 */
export function extractHashtags({body} : ExtractHashtagsProps) : string[] {

    const hashtags = body.match(hashtagRegex)
    if(!hashtags) return []

    const hashtagsLowercase = hashtags.map(tag => tag.toLowerCase() ) as RegExpMatchArray
    if( !hashtagsLowercase ) return []

    const hashtagsUnique = Array.from( new Set(hashtagsLowercase) )

    return hashtagsUnique
}