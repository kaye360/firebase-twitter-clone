
import { query, orderBy, onSnapshot, DocumentData, Query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Post, postCollectionRef } from '../services/PostService'
import { getUsers } from '../services/UserServices'


export interface UseGetPostsProps {
    userId? : string
}

export default function useGetPosts( { userId } : UseGetPostsProps ) : Post[] | null {

    let q: Query<DocumentData>

    if( userId ) {

        q = query( postCollectionRef, where('userId', '==', userId), orderBy("date", "desc") )

    } else {
        q = query( postCollectionRef, orderBy("date", "desc") )
    }


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
