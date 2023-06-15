import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { AsynchronousResponse, User, UserNotification } from "../utils/types";
import { db } from "../../firebase-config";
import { AsyncResponse } from "../utils/AsyncResponse";


interface SendNotificationProps {
    userId : string,
    notification : UserNotification
}

export async function sendNotification( {userId, notification} : SendNotificationProps) : Promise<AsynchronousResponse> {
    try {

        const userRef = doc(db, "users", userId);

        notification.message = notification.message.slice(0, 75) + '..."'

        await updateDoc(userRef, {
            notificationsNew: arrayUnion(notification)
        });

        return AsyncResponse.success({message : 'Notification sent.'})

    } catch (error) {
        return AsyncResponse.error({message : 'Notification not sent.'})
    }
}




interface MarkNotifcationsAsReadProps {
    userId : string
}

export async function markNotifcationsAsRead({userId} : MarkNotifcationsAsReadProps) : Promise<AsynchronousResponse> {
    try {
        const userRef  = doc(db, "users", userId);
        const userSnap = await getDoc(userRef)
        const user = userSnap.data() as User

        if( !user.notificationsNew || !user.notificationsOld) return { success : false, message: '' }

        const notificationsMarkedAsRead: UserNotification[] = [...user.notificationsOld, ...user.notificationsNew].splice(-50)

        await updateDoc(userRef, {
            notificationsNew : [],
            notificationsOld : notificationsMarkedAsRead
        });

        return AsyncResponse.success()

    } catch (error) {
        return AsyncResponse.error()
    }
}
