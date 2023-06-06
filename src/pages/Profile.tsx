
import { Suspense, useState, useEffect, useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router-dom'
import PostList from '../components/PostList'
import { PostCardLoader } from '../components/PostCard/PostCardLoader'
import { PostListError } from './Explore'
import Icon from '../components/Icon'
import { getUser } from '../services/UserServices'
import { AppContext } from '../App'
import { User } from '../utils/types'
import useGetPosts from '../hooks/useGetPosts'

export default function Profile() {

    const appContext      = useContext(AppContext)
    const { id }          = useParams()
    const [user, setUser] = useState<User | null>(null)
    
    let userId  = id ? id : appContext?.firebaseAuth?.uid
    const posts = useGetPosts({userId})

    
    useEffect( () => {
        ( async function loadUserData () {
            const userData = await getUser(userId) as User
            setUser(userData)
        })()
    }, [id])

    

    const loader = (
		<>
			<PostCardLoader />
			<PostCardLoader />
			<PostCardLoader />
			<PostCardLoader />
		</>
	)

    return (
		<div className="flex flex-col gap-8 rounded-xl p-4">

			<h1 className='m-0'>
                @{ user?.handle }
            </h1>

            <div className='flex flex-col gap-4 bg-gradient-to-r from-blue-100 via-blue-50 to-fuchsia-50 text-blue-800 p-8 rounded-xl'>
                <div>
                    <span className='font-bold'>Bio: </span>{ user?.bio || 'Not Available' }
                </div>

                <div className='h-[1px] bg-blue-200'></div>

                <div className='flex items-center gap-2'>
                    <Icon icon="place" /> {user?.location || 'Not Available'}
                </div>
            </div>

			<ErrorBoundary fallback={<PostListError />}>
				<Suspense fallback={loader}>
					<PostList posts={posts} />
				</Suspense>
			</ErrorBoundary>
			
		</div>
    )
}
