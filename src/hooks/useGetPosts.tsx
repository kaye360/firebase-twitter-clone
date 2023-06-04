
import { query, orderBy, onSnapshot, DocumentData, Query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { postCollectionRef } from '../services/PostService'
import { getUsers } from '../services/UserServices'
import { Post } from '../utils/types'

/**
 * If userId is passed in as a prop, only posts from that user will be fetched
 */

export interface UseGetPostsProps {
    userId? : string,
    tag?    : string,
}

export default function useGetPosts( { userId, tag } : UseGetPostsProps ) : Post[] | null {

    let q: Query<DocumentData>

    if( userId ) {
        q = query( postCollectionRef, where('userId', '==', userId), orderBy("date", "desc") )
        
    } else if ( tag ) {
        q = query( postCollectionRef, where('hashtags', 'array-contains', tag), orderBy("date", "desc") )
        
    } else {
        q = query( postCollectionRef, orderBy("date", "desc") )
    }

    const [posts, setPosts] = useState<Post[] | null>(null)

    useEffect( () => {
        ( async function getPostsWithUsers() {
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
        })()
    }, [userId])

    return posts
}
