
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
export function extractHashtags({body} : ExtractHashtagsProps) : RegExpMatchArray | null {

    const hashtags          = body.match(hashtagRegex)
    const hashtagsLowercase = hashtags?.map(tag => tag.toLowerCase() ) as RegExpMatchArray | null

    return hashtagsLowercase
}