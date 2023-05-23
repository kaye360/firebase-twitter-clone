import { Suspense, lazy } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Link } from "react-router-dom"
import { PostCardLoader } from "../components/PostCardComponents"

const PostList = lazy( () => import("../components/PostList") )

export default function Explore() {

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

			<h2>Explore</h2>

			<ErrorBoundary fallback={<PostListError />}>
				<Suspense fallback={loader}>
					<PostList />
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


