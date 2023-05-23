
import { query, orderBy, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Post, postCollectionRef } from '../services/PostService'
import { getUsers } from '../services/UserServices'

export default function useGetPosts() : Post[] | null {

    const q = query( postCollectionRef, orderBy("date", "desc"), )

    const [posts, setPosts] = useState<Post[] | null>(null)

    useEffect( () => {

        async function getPostsWithUsers() {
            const users = await getUsers()

            onSnapshot( q, snap => 
                setPosts( snap.docs.map( doc => {
                    return ({
                        ...doc.data(),
                        id: doc.id,
                        user : users?.[doc.data().userId]
                    } as Post )
                }))
            )
        }

        getPostsWithUsers()
    }, [])

    return posts
}
