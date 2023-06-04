import { getAllRecentHashtags } from "../services/HashtagService"
import { useEffect, useState } from "react"
import { RecentHashtags } from "../utils/types"
import { Link } from "react-router-dom"
import { SearchBar } from "../components/SearchBar"



export default function Trending() {

	const [tags, setTags] = useState<RecentHashtags[]>([])
	
	useEffect( () => {
		( async function loadAllRecentTags() {
			const recentTags = await getAllRecentHashtags()
			setTags(recentTags)
		})()
	}, [])

	return (
		<div>
			<h1>What's Trending</h1>

			<SearchBar />

			<p className="my-6">
				See what the community is talking about:
			</p>

			<div className="flex items-center flex-wrap gap-4 rounded-xl border border-blue-100 bg-blue-50 p-6">
				{ tags.map( tag => (
					<Link to={`/tag/${tag.tag.replace('#', '')}`}
						className={`
							${tag.count === 1 ? 'text-md'   : ''}
							${tag.count === 2 ? 'text-xl'   : ''}
							${tag.count === 3 ? 'text-2xl'  : ''}
							${tag.count > 3   ? 'text-4xl'  : ''}
							rounded-lg inline-block px-2
							hover:bg-rose-200
						`}
						key={tag.tag}
					>
						{tag.tag}
					</Link>
				))}
			</div>
		</div>
	)
}
