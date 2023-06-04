
export const hashtagRegex = /(#+[a-zA-Z0-9-]{1,})/g

interface ExtractHashtagsProps {
    body : string,
}

export function extractHashtags({body} : ExtractHashtagsProps) : string[] | null {
    return body.match(hashtagRegex)
}