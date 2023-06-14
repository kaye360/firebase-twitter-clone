import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Icon from "./Icon"
import Button from "./Button"
import { onSnapshot, DocumentReference, DocumentData, doc } from "firebase/firestore"
import { auth, db } from "../../../firebase-config"
import { AppContext } from "../../App"
import CreatePost from "../../modals/CreatePost"
import { User } from "../../utils/types"



export default function NavLinks() {

    return (
        <NavWrapper>
            <NavLink to="/"         icon="description">Home</NavLink>
            <NavLink to="/explore"  icon="explore">Explore</NavLink>
            <NavLink to="/trending" icon="tag">Trending</NavLink>
            <NavSpacer />

            { auth.currentUser &&
                <div className="md:static flex md:flex-col gap-1">
                    <NavLink to="/notifications" icon="notifications">
                        Notifications
                        <NotifcationBubble />
                    </NavLink>

                    <NavLink to="/profile"  icon="account_circle" className="hidden md:flex">Profile </NavLink>
                    <NavLink to="/settings" icon="settings">Settings</NavLink>
                    <NavSpacer />
                </div>
            }

            <CreatePostBtn />
        </NavWrapper>
    )
}




function NavWrapper({children} : {children : any}) {
    return (
        <ul className="fixed z-50 -bottom-1 left-0 right-0 md:static flex justify-evenly md:flex-col gap-0 mt-4 text-md text-blue-600 bg-blue-100 md:bg-transparent">{children}</ul>
    )
}





interface NavLinkProps {
    to         : string,
    icon       : string,
    className? : string,
    children   : any
}

function NavLink({to, icon, className = '', children} :  NavLinkProps) {
    return (
        <li>
            <Link to={to} className={`nav-link relative flex flex-col md:flex-row items-center w-full px-1 md:px-4 py-3 md:gap-4 text-xs md:text-base font-medium hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-200 transition-all duration-100 ${className}`}>
                <Icon icon={icon}  className="nav-icon"/>
                {children}
            </Link>
        </li>
    )
}




function CreatePostBtn() {

    const appContext = useContext(AppContext)

    return (
        <li className="absolute right-2 bottom-20 md:static">
            <Button 
                className="relative mt-2 w-12 h-12 md:w-full md:h-12 bg-blue-700 md:bg-gradient-to-br from-blue-200 via-rose-200 to-blue-200  text-blue-600 font-bold rounded-full md:rounded-lg hover:bg-rose-500 transition-all duration-100"
                onClick={ () => {
                    appContext?.setModal(<CreatePost />)
                }}
            >
                <span className="absolute inset-[2px] flex items-center gap-2 justify-center rounded-md bg-blue-700 md:bg-blue-50 hover:bg-blue-200 transition-all">
                    <span className="hidden md:block">
                        Add Post
                    </span>
                    <Icon icon="add_comment" className="rotate-y-180 text-blue-100 md:text-inherit" />
                </span>
            </Button>
        </li>
    )
}



function NavSpacer() {
    return (
        <div className="hidden md:block h-[1px] my-2 bg-blue-100"></div>
    )
}



function NotifcationBubble() {

    const [notificationCount, setNotificationCount] = useState<number>(0)
    let userRef: DocumentReference<DocumentData> | null = null


    if( auth.currentUser ) {
        userRef = doc(db, "users", auth.currentUser?.uid as string)
    }


    useEffect( () => {
        ( function loadNotificationsForCurrentUser() {

            if( !auth.currentUser ) {
                setNotificationCount(0)
                return
            }

            onSnapshot( userRef as DocumentReference<DocumentData>, snap => {
                const user = snap.data() as User
                if( typeof user === 'object' && 'notificationsNew' in user ) {
                    setNotificationCount( user.notificationsNew.length )
                }
            })
        })()
    }, [auth.currentUser])


    if( notificationCount && notificationCount > 0) {
        return (
            <div className="absolute -top-[16px] right-0 md:static grid place-items-center rounded-full px-3 py-2 md:px-2 md:py-[3px] bg-rose-400 text-white text-base md:text-sm font-black leading-none">
                {notificationCount}
            </div>
        )
    }

    
    // Spacer for no 0 notifications
    return <div className="px-3 py-2 md:px-2 md:py-[3px]"></div>
}