import { Suspense, lazy } from "react";
import { Post } from "../services/PostService";
import { ErrorBoundary } from "react-error-boundary";
import { SinglePostError } from "./PostCard/PostCardElement";
import { PostCardLoader } from "./PostCard/PostCardLoader";


const PostCardElement = lazy(() => import("./PostCard/PostCardElement"))



export interface PostCardProps {
    post                  : Post | null,
    isLoaded              : boolean,
    isShowingViewPostBtn? : boolean
}


export default function PostCard({post, isLoaded, isShowingViewPostBtn = true} : PostCardProps) {

    const loader = <PostCardLoader />

    return (
        <ErrorBoundary FallbackComponent={SinglePostError}>
            <Suspense fallback={loader}>
                <PostCardElement 
                    post={post as Post} 
                    isShowingViewPostBtn={isShowingViewPostBtn} 
                    isLoaded={isLoaded}
                />
            </Suspense>
        </ErrorBoundary>
    )
}



