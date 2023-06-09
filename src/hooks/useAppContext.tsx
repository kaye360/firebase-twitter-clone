import { User as FirebaseUser } from "firebase/auth"
import { Dispatch, useEffect, useState } from "react"
import { auth } from "../../firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import { getUser } from "../services/UserServices"

export interface UseAppContext {
    firebaseAuth      : FirebaseUser | undefined | null,
    userHandle        : string | null,
    setUserHandle     : Dispatch<React.SetStateAction<string | null>>,
    modal             : JSX.Element | null,
    setModal          : Function,
    closeModal        : Function,
    signOutUser       : Function,
}

export default function useAppContext() : UseAppContext | null  {

    /**
     * Firebase
     */
    const [firebaseAuth] = useAuthState(auth)




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
        }

  
    return { firebaseAuth, userHandle, setUserHandle, signOutUser, modal, setModal, closeModal }
}
