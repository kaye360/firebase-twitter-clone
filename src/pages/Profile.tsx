
import { Suspense, useState, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router-dom'
import PostList from '../components/PostList'
import { PostCardLoader } from '../components/PostCardComponents'
import { PostListError } from './Explore'
import Icon from '../components/Icon'
import { User, getUser } from '../services/UserServices'

export default function Profile() {

    const { id } = useParams()

    const [user, setUser] = useState<User | null>(null)

    useEffect( () => {
        const loadUserData = async () => {
            const userData = await getUser(id) as User
            setUser(userData)
        }
        loadUserData()
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

			<h2 className='text-2xl border-b border-sky-100 text-sky-600'>
                @{user?.handle}
            </h2>

            <div className='flex flex-col gap-4 bg-gradient-to-r from-sky-100 via-sky-100 to-fuchsia-100 text-sky-800 p-8 rounded-xl'>
                <div>
                    Bio here. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam sint eos libero fugiat natus voluptatum?
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
