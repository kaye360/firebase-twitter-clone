
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Post } from '../services/PostService'
import { db } from '../../firebase-config'
import { Users, getUsers } from '../services/UserServices'

interface UseGetSinglePost {
    post     : Post | null,
    isLoaded : boolean
}

export default function useGetSinglePost(postId : string) : UseGetSinglePost {

    const postRef                 = doc(db, "posts", postId)
    const [post, setPost]         = useState<Post | null>(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect( () => {
        ( async function getPostWithUser() {
            const users = await getUsers() as Users

            onSnapshot( postRef, snap => {

                setPost( { 
                    ...snap.data(), 
                    id   : postId,
                    user : users[snap?.data()?.userId]
                } as Post )

                setIsLoaded(true)
            })
        })()
    }, [postId])

    return { post, isLoaded}
}
