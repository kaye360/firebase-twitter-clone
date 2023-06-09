import { useContext, useEffect, useState } from "react"
import { getUsers } from "../services/UserServices"
import { Users } from "../utils/types"
import { Link } from "react-router-dom"
import Avatar from "../components/Layout/Avatar"
import { ModalContext } from "../App"



interface ViewPostLikesProps {
    likes : string[]
}

export default function ViewPostLikes({likes} : ViewPostLikesProps) {

    const modal = useContext(ModalContext)

    const [users, setUsers] = useState< Users | null>(null)


    useEffect( () => {
        ( async function loadUserHandles() {
            const loadUsers = await getUsers()
            setUsers(loadUsers)
        })()
    }, [])


    return (
        <div className="grid gap-4">

            <h3 className="font-bold text-md">Users who liked this post:</h3>
            { users && likes.map( user => (
                users[user] && (
                    <Link
                        to={`profile/${user}`}
                        key={user}
                        className="flex items-center gap-2 pl-2 rounded-xl hover:underline hover:bg-blue-100 py-2"
                        onClick={() => modal.close() }
                    >
                        <Avatar src={users[user].avatar} />

                        <span>
                            {users[user].handle}
                        </span>
                    </Link>
                )
            ))}

            { likes.length === 0 && (
                <p>
                    This post doesn't have any likes yet.
                </p>
            )}
        </div>
    )
}
