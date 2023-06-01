

export interface User {
	handle		     : string,
	avatar	         : string,
	notifcations_new : Notification[],
	notifcations_old : Notification[],
	bio			 	 : string,
	location	 	 : string
}


export interface Users {
	[key : string] : User
}


export interface PostComment {
    postId    : string,
    userId    : string,
    comment   : string,
    commentId : string
}


export interface Notification {
    type    : 'comment' | 'like' | 'repost',
    message : string,
    link    : string,
}


export interface ResponseSuccess{
    success  : boolean,
    message  : string,
    content? : string
}