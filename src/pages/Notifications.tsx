import { useContext, useEffect, useState } from "react";
import Icon from "../components/Icon";
import { UserNotification } from "../utils/types";
import { AppContext } from "../App";
import { getUser } from "../services/UserServices";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { markNotifcationsAsRead } from "../services/NotificationService";



export default function Notifications() {

    const appContext = useContext(AppContext)
    const [newNotifications, setNewNotifications] = useState<UserNotification[]>([])
    const [oldNotifications, setOldNotifications] = useState<UserNotification[]>([])


    useEffect( () => {
        ( async function loadUserNotifications() {

            if( !appContext?.firebaseAuth?.uid ) return
            const user = await getUser((appContext.firebaseAuth.uid))

            if( !user ) return
            
            setNewNotifications(user.notificationsNew.reverse() as UserNotification[])
            setOldNotifications(user.notificationsOld.reverse() as UserNotification[])
        })()
    }, [appContext?.notificationCount])


    async function handleMarkAsRead() {
        await markNotifcationsAsRead({userId: appContext?.firebaseAuth?.uid as string})
    }


    const icons = {
        like    : 'favorite',
        comment : 'chat_bubble',
        repost  : 'sync',
        default : 'notifications'
    } as {[key: string] : string}
    

    return (
        <div>
            <h1><Icon icon="notifications" /> Notifications</h1>

            <div className="flex items-center justify-between">
                <h2>New</h2>

                <Button onClick={handleMarkAsRead} className="border border-blue-200 hover:bg-blue-100">
                    Mark as Read
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                { newNotifications?.map((notification, index) => (
                    <Link 
                        to={notification.link}
                        className="flex items-center gap-4 px-1 py-3 border-b border-blue-100 hover:bg-blue-50"
                        key={index}
                    >
                        <Icon icon={ icons[notification.type] || icons.default } className="text-blue-300" />
                        {notification.message}
                    </Link>
                ))}

                { newNotifications?.length === 0 &&
                    'You are up to date.'
                }

            </div>

            <h2 className="mt-6 mb-2 pt-6 border-t border-slate-200">Read</h2>

            <div className="flex flex-col gap-4">
                { oldNotifications?.map((notification, index) => (
                    <Link 
                        to={notification.link}
                        className="flex items-center gap-4 px-1 py-4 border-b border-blue-100 hover:bg-blue-50"
                        key={index}
                    >
                        <Icon icon={ icons[notification.type] || icons.default } className="text-blue-300" />
                        {notification.message}
                    </Link>
                ))}

                { oldNotifications?.length === 0 &&
                    'You have no previous notifications.'
                }
            </div>

        </div>
    )
}
