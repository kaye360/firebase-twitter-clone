import { SyntheticEvent, useState } from "react"
import { PostComment } from "../utils/types"
import Button from "../components/Button"

interface EditCommentProps {
    comment : PostComment,
}

export default function EditComment({comment} : EditCommentProps) {

    console.log(comment)


    function handleOnChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLTextAreaElement) ) return
        setCommentBody(e.target.value)
    }


    function handleSubmit() {

    }

    return (
        <form onSubmit={ handleSubmit }>

            <div className="flex flex-col gap-4 items-start">

                <h2>Edit Comment</h2>

                <textarea
                    value={commentBody}
                    onChange={ handleOnChange }
                    className="p-4 rounded-lg border w-full h-36"
                ></textarea>

                <div className="flex items-center gap-4">
                    <Button
                        icon="chat_bubble"
                        disabled={!isValidated}
                        className="bg-blue-200 text-blue-700 hover:bg-orange-100 hover:text-orange-400"
                    >
                        Edit Comment
                    </Button>
                </div>

            </div>

        </form>
    )
}