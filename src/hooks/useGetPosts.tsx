
import { query, orderBy, onSnapshot, DocumentData, Query, where, limit, getCountFromServer } from 'firebase/firestore'
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

export interface UseGetPosts {
    posts        : Post[],
    gotoNextPage : Function,
    totalPosts   : number,
}

export default function useGetPosts( { userId, tag } : UseGetPostsProps ) : UseGetPosts {

    let postQuery       : Query<DocumentData>
    let totalPostsQuery : Query<DocumentData>
    const perPage       : number = 10


    const [posts, setPosts]           = useState<Post[]>([])
    const [postsLimit, setPostsLimit] = useState<number>(perPage)
    const [totalPosts, setTotalPosts] = useState<number>(0)


    function gotoNextPage() {
        setPostsLimit(postsLimit + perPage)
    }


    if( userId ) {
        postQuery = query( postCollectionRef, where('userId', '==', userId), orderBy("date", "desc") )
        
    } else if ( tag ) {
        postQuery = query( postCollectionRef, where('hashtags', 'array-contains', tag), orderBy("date", "desc") )
        
    } else {
        postQuery       = query( postCollectionRef, orderBy("date", "desc"), limit(postsLimit) )
        totalPostsQuery = query( postCollectionRef )
    }
    

    useEffect( () => {
        ( async function getPostsWithUsers() {
            const users = await getUsers()

            const totalPostsSnap = await getCountFromServer(totalPostsQuery)
            setTotalPosts(totalPostsSnap.data().count)

            onSnapshot( postQuery, snap => 
                setPosts( snap.docs.map( doc => {
                    return ({
                        ...doc.data(),
                        id: doc.id,
                        user : users?.[doc.data().userId]
                    } as Post )
                }))
            )
        })()
    }, [userId, tag, postsLimit])


    return { posts, gotoNextPage, totalPosts }
}
