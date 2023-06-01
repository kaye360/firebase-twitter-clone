
import { Dispatch, useEffect, useState } from "react"
import { getUsers } from "../../services/UserServices"
import CommentCard from "./CommentCard"
import { useLocation } from "react-router-dom"
import { PostComment, User, Users } from "../../utils/types"

interface CommentListProps {
    comments : PostComment[]
}

export default function CommentList({comments} : CommentListProps)  {

    const { hash } = useLocation()

    const [users, setUsers] = useState<Users | null>(null)
    const [pageIsLoaded, setPageIsLoaded] = useState<boolean>(false)

    useEffect( () => {
        ( async function getAllUsers() {
            const getAll = await getUsers() as Users
            setUsers(getAll)
        })()
    }, [])

    useScrollToHash({comments, hash, pageIsLoaded, setPageIsLoaded})
    
    return (
        <div id="comments">

            <header className="flex justify-between my-4 py-2 border-b border-slate-200">
                <h2>
                    Comments
                </h2>

                <a href="#comment-form" className="text-sky-600 hover:underline">
                    Leave a comment
                </a>
            </header>

            <div className="flex flex-col gap-4">
                { comments?.map( (comment, key) => {

                    let currentCommentUser: User | null = users
                        ? users[comment.userId]
                        : null
                    
                    return <CommentCard comment={comment} user={ currentCommentUser } key={key} /> 
                }
                )}
            </div>

            { !comments && <CommentIsEmpty /> }

        </div>
    )
}




function CommentIsEmpty() {
    return (
        <div id="comments">
            <p>
                This post has no comments.
            </p>
        </div>
    )
}


interface UseScrollToHash {
    comments        : PostComment[],
    hash            : string,
    pageIsLoaded    : boolean,
    setPageIsLoaded : Dispatch<React.SetStateAction<boolean>>
}

function useScrollToHash({comments, hash, pageIsLoaded, setPageIsLoaded} : UseScrollToHash) {
   
    useEffect( () => {
        if(comments) setPageIsLoaded(true)
    }, [comments])

    useEffect( () => {

        const hashElement = hash.length > 0
            ? document.querySelector(hash)
            : null

        if ( hashElement ) {
            setTimeout( () => {
                scrollTo(0, hashElement.getBoundingClientRect().top)
            }, 1000)
        }

    }, [pageIsLoaded]) 
}