
import { Suspense, useState, useEffect, useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router-dom'
import PostList from '../components/PostList'
import { PostCardLoader } from '../components/PostCard/PostCardLoader'
import { PostListError } from './Explore'
import Icon from '../components/Icon'
import { User, getUser } from '../services/UserServices'
import { AppContext } from '../App'

export default function Profile() {

    const { id }          = useParams()
    const [user, setUser] = useState<User | null>(null)
    const appContext      = useContext(AppContext)

    useEffect( () => {
        ( async function loadUserData () {
            const userId = id ? id : appContext?.firebaseAuth?.uid
            const userData = await getUser(userId) as User
            setUser(userData)
        })()
    }, [])

    

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

			<h1>
                @{ user?.handle || 'deleted' }
            </h1>

            <div className='flex flex-col gap-4 bg-gradient-to-r from-sky-100 via-sky-50 to-fuchsia-50 text-sky-800 p-8 rounded-xl'>
                <div>
                    { user?.bio }
                </div>

                <div className='h-[1px] bg-sky-200'></div>

                <div className='flex items-center gap-2'>
                    <Icon icon="place" /> BC, Canada
                </div>
            </div>

			<ErrorBoundary fallback={<PostListError />}>
				<Suspense fallback={loader}>
					<PostList userId={id} />
				</Suspense>
			</ErrorBoundary>
			
		</div>
    )
}
