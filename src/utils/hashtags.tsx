
export const hashtagRegex = /(#+[a-zA-Z0-9-]{1,})/g

interface ExtractHashtagsProps {
    string : string,
}

/**
 * @function extractHashtags
 * 
 * This function extracts hashtags from a text string and returns them as an array
 * All hashtags are stored as lowercase
 */
export function extractHashtags({string} : ExtractHashtagsProps) : string[] {

    if( typeof string !== 'string') throw 'Invalid string argument in extractHashtags()'

    const hashtags = string.match(hashtagRegex)
    if(!hashtags) return []

    const hashtagsLowercase = hashtags.map(tag => tag.toLowerCase() ) as RegExpMatchArray
    if( !hashtagsLowercase ) return []

    const hashtagsUnique = Array.from( new Set(hashtagsLowercase) )

    return hashtagsUnique
}