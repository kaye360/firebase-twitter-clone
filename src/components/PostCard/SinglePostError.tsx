import { useNavigate } from "react-router-dom"


export interface SinglePostErrorProps {
    error: string
}

export function SinglePostError({ error } : SinglePostErrorProps): JSX.Element {


    const navigate = useNavigate()

    

    return (
        <div role="alert" className="flex flex-col items-start gap-4 p-4 bg-rose-50 rounded-lg">

            <p className="font-bold">
                {error}
            </p>

            <p>
                This post may have been deleted. Otherwise, please try again later.
            </p>

            <button onClick={() => navigate(-1)} className="underline">
                Go Back
            </button>

        </div>
    )
}