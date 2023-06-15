import { Timestamp } from "firebase/firestore"


export interface User {
	handle		     : string,
	avatar	         : string | null,
	notificationsNew : UserNotification[],
	notificationsOld : UserNotification[],
	bio			 	 : string,
	location	 	 : string,
}


export interface Users {
	[key : string] : User,
}


export interface Post {
    body      : string,
    date      : Timestamp,
    userId    : string,
    id        : string | undefined,
    user?     : User,
    likes     : string[],
    comments  : PostComment[],
    reposts   : number,
    repostId? : string,
    hashtags  : string[],
}


export interface PostComment {
    postId    : string,
    userId    : string,
    comment   : string,
    commentId : string,
}


export interface UserNotification {
    type    : 'comment' | 'like' | 'repost',
    message : string,
    link    : string,
}


export interface AsynchronousResponse{
    success  : boolean,
    message? : string,
    content? : string,
}


export interface RecentHashtags {
    tag   : string,
    count : number
}