
export const hashtagRegex = /(#+[a-zA-Z0-9-]{1,})/g

interface ExtractHashtagsProps {
    body : string,
}

// All hashtags are stored as lowercase
export function extractHashtags({body} : ExtractHashtagsProps) : string[] | null {
    let hashtags = body.match(hashtagRegex)
    hashtags = hashtags?.map(tag => tag.toLowerCase() ) as RegExpMatchArray | null
    return hashtags
}