

interface HashtagsPreviewProps {
    hasHashtags : boolean,
    hashtags    : string[]
}

export default function HashtagsPreview({hasHashtags, hashtags} : HashtagsPreviewProps) {
    return (
        <div
            className={` ${hasHashtags ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 py-2`}
        >
            <div className="overflow-hidden flex items-center flex-wrap gap-2">

                {hasHashtags &&
                    <span className="font-bold">Hashtags:</span>
                }

                {hashtags.map((tag, index) => (
                    <span className="px-3 py-1 border rounded-lg" key={index}>
                        {tag}
                    </span>
                ))}

            </div>
        </div>
    )
}
