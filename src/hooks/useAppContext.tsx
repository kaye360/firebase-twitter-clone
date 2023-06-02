import { User as FirebaseUser } from "firebase/auth"
import { Dispatch, MouseEventHandler, useEffect, useState } from "react"
import { auth, db } from "../../firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import { getUser } from "../services/UserServices"
import { DocumentData, DocumentReference, doc, onSnapshot } from "firebase/firestore"
import { User } from "../utils/types"

export interface UseAppContext {
    firebaseAuth      : FirebaseUser | undefined | null,
    userHandle        : string | null,
    setUserHandle     : Dispatch<React.SetStateAction<string | null>>,
    notificationCount : number
    modal             : JSX.Element | null,
    setModal          : Function,
    closeModal        : MouseEventHandler<HTMLButtonElement>,
    signOutUser       : Function,
}

export default function useAppContext() : UseAppContext | null  {


    /**
     * Firebase
     */
    const [firebaseAuth] = useAuthState(auth)

    let userRef: DocumentReference<DocumentData> | null = null

    if( firebaseAuth ) {
        userRef = doc(db, "users", firebaseAuth?.uid as string)
    }



    /**
     * User handle State
     */
    const [userHandle, setUserHandle] = useState<string | null>(null)

    useEffect( () => {

        async function getUserService(id: string) : Promise<void> {
            const user = await getUser(id)
            setUserHandle(user?.handle as string)
        }

        if(firebaseAuth) {
            getUserService(firebaseAuth.uid)
        }

    }, [firebaseAuth])



    /**
     * User Notifications
     */
    
    const [notificationCount, setNotificationCount] = useState<number>(0)

    useEffect( () => {
        ( async function loadNotificationsForCurrentUser() {

            if( !firebaseAuth ) {
                setNotificationCount(0)
                return
            }

            onSnapshot( userRef as DocumentReference<DocumentData>, snap => {
                const user = snap.data() as User
                
                if( user.notificationsNew ) {
                    setNotificationCount( user.notificationsNew.length )
                }
            })
        })()
    }, [firebaseAuth])



    /**
     * Layout Modal State
     */

    const [modal, setModal] = useState<JSX.Element | null>(null)

    function closeModal() : void {
        setModal(null)
    }



    /**
     * Sign Out Function
     */
        function signOutUser() {
            setUserHandle(null)
            setNotificationCount(0)
        }

  
    return { firebaseAuth, userHandle, setUserHandle, signOutUser, notificationCount, modal, setModal, closeModal }
}
