import { Suspense, lazy } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Link } from "react-router-dom"
import { PostCardLoader } from "../components/Posts/PostCard/PostCardLoader"
import useGetPosts from "../hooks/useGetPosts"
import Icon from "../components/Layout/Icon"

const PostList = lazy( () => import("../components/Posts/PostList") )

export default function Explore() {

	const posts = useGetPosts({})

	const loader = (
		<>
			<PostCardLoader />
			<PostCardLoader />
			<PostCardLoader />
			<PostCardLoader />
		</>
	)

	return (
		<div className="flex flex-col gap-8 rounded-xl">

			<h1><Icon icon="explore" /> Explore</h1>

			<ErrorBoundary fallback={<PostListError />}>
				<Suspense fallback={loader}>
					<PostList posts={posts} />
				</Suspense>
			</ErrorBoundary>
			
		</div>
	)
}



export function PostListError() {
	return(
		<div role="alert" className="flex flex-col gap-4 p-4 bg-rose-100 rounded-lg">

			<p className="font-bold">
				Error getting posts.
			</p>

			<p>
				Please try again later
			</p>

			<Link to="/" className="underline">Back to home</Link>

		</div>
	)
}


