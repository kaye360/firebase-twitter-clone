import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { ResponseSuccess, User, UserNotification } from "../utils/types";
import { db } from "../../firebase-config";


interface SendNotificationProps {
    userId : string,
    notification : UserNotification
}

export async function sendNotification( {userId, notification} : SendNotificationProps) : Promise<ResponseSuccess> {
    try {

        const userRef = doc(db, "users", userId);

        notification.message = notification.message.slice(0, 75) + '..."'

        await updateDoc(userRef, {
            notificationsNew: arrayUnion(notification)
        });

        return {success: true, message : 'Notifcation sent.'} as ResponseSuccess
    } catch (error) {
        
        return {success: false, message : 'Notifcation not sent.'} as ResponseSuccess
    }
}




interface MarkNotifcationsAsReadProps {
    userId : string
}

export async function markNotifcationsAsRead({userId} : MarkNotifcationsAsReadProps) : Promise<ResponseSuccess> {
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

        return { success: true, message: ''}
    } catch (error) {
        
        return {} as ResponseSuccess
    }
}
