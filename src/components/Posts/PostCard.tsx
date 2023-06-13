import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PostCardLoader } from "./PostCard/PostCardLoader";
import { SinglePostError } from "./PostCard/SinglePostError";
import { Post } from "../../utils/types";


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



