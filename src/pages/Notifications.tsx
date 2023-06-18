import { useEffect, useState } from "react";
import { UserNotification } from "../utils/types";
import { getUser } from "../services/UserServices";
import { Link } from "react-router-dom";
import { markNotifcationsAsRead } from "../services/NotificationService";
import { motion } from "framer-motion";
import { auth } from "../../firebase-config";
import Button from "../components/Layout/Button";
import Icon from "../components/Layout/Icon";



export default function Notifications() {

    const [newNotifications, setNewNotifications] = useState<UserNotification[]>([])
    const [oldNotifications, setOldNotifications] = useState<UserNotification[]>([])


    const userId = auth.currentUser?.uid

    async function loadUserNotifications() {

        if( !userId ) return
        const user = await getUser((userId))

        if( !user ) return
        
        setNewNotifications(user.notificationsNew.reverse() as UserNotification[])
        setOldNotifications(user.notificationsOld.reverse() as UserNotification[])
    }

    useEffect( () => {
        loadUserNotifications()
    }, [auth.currentUser])


    async function handleMarkAsRead() {
        if( typeof userId === 'string' ) {
            await markNotifcationsAsRead({userId})
            await loadUserNotifications()
        }
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

            <motion.div layout className="flex flex-col gap-4">

                { newNotifications?.map((notification, index) => (
                    <Notification
                        link={ notification.link }
                        icon={ icons[notification.type] || icons.default }
                        message={ notification.message }
                        key={index} 
                    />
                ))}


            </motion.div>

            { newNotifications?.length === 0 && <p>You are up to date.</p> }

            <h2 className="mt-6 mb-2 pt-6 border-t border-slate-200">Read</h2>

            <div className="flex flex-col gap-4">

                { oldNotifications?.map((notification, index) => (
                    <Notification
                        link={ notification.link }
                        icon={ icons[notification.type] || icons.default }
                        message={ notification.message }
                        key={index} 
                    />
                ))}

                { oldNotifications?.length === 0 && 'You have no previous notifications.' }

            </div>

        </div>
    )
}



interface NotificationProps {
    link    : string,
    icon    : string,
    message : string,
}

function Notification({link, icon, message} : NotificationProps) {
    return (
        <Link to={ link }>
            <motion.div layout
                className="flex items-center gap-4 px-1 py-3 border-b border-blue-100 hover:bg-blue-50"
            >
                <Icon icon={ icon } className="text-blue-300" />
                { message }
            </motion.div>
        </Link>
    )
}