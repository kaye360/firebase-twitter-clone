import { Suspense, lazy } from "react";
import { Post } from "../services/PostService";
import { ErrorBoundary } from "react-error-boundary";
import { PostCardLoader, SinglePostError } from "./PostCardComponents";

const PostCardElement = lazy(() => import("./PostCardComponents"))



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



