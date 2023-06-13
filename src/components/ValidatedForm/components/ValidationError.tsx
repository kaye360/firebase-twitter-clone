

interface ValidationErrorProps {
    message : string
}

export default function ValidationError({message} : ValidationErrorProps) {

    return (
        <div className={` 
            ${message ? 'grid grid-rows-[1fr] py-2' : 'grid-rows-[0fr]'} 
            transition-[grid-template-rows] duration-200 text-rose-500 leading-none
        `}>
            <div className="overflow-hidden">
                {message}
            </div>
        </div>
    )
}
