import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ResponseSuccess, UserNotification } from "../utils/types";
import { db } from "../../firebase-config";


interface SendNotificationProps {
    userId : string,
    notification : UserNotification
}

export async function sendNotification( {userId, notification} : SendNotificationProps) : Promise<ResponseSuccess> {
    try {

        const userRef = doc(db, "users", userId);

        notification.message = notification.message.slice(0, 50) + '..."'


        // Atomically add a new region to the "regions" array field.
        await updateDoc(userRef, {
            notifications_new: arrayUnion(notification)
        });
        return {success: true, message : 'Notifcation sent.'} as ResponseSuccess
    } catch (error) {
        
        return {success: false, message : 'Notifcation not sent.'} as ResponseSuccess
    }
}

interface MarkNotifcationsAsReadProps {
    userId : string
}

export function markNotifcationsAsRead({userId} : MarkNotifcationsAsReadProps) : ResponseSuccess {
    try {
        userId
        return {} as ResponseSuccess
    } catch (error) {
        
        return {} as ResponseSuccess
    }
}