import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { auth, db } from "../../firebase-config"
import { User } from "../utils/types"
import { setUser } from "../slices/userSlice"
import { useAuthState } from "react-firebase-hooks/auth"

export default function useUpdateUser() {

    const [firebaseAuth] = useAuthState(auth);

    const dispatch = useDispatch()

    let userId: string | null = null
    

    useEffect( () => {
        
        ( async function loadUser() {

            if( !firebaseAuth || typeof auth.currentUser?.uid !== 'string' ) return


            userId         = auth.currentUser?.uid
            const userRef  = doc(db, "users", userId)
            const userSnap = await getDoc(userRef)
            let user 	   = userSnap.data() as User
    

            if( !userSnap.exists() ) {
                
                // Create a new user in users collection if not already created
                user = {
                    handle			 : auth.currentUser.email?.split('@')[0].substring(0,15) as string,
                    avatar			 : auth.currentUser.photoURL as string, 
                    bio 			 : 'Hi! I\'m new to this app.',
                    location 		 : 'Earth',
                    notificationsNew : [],
                    notificationsOld : [],
                }
                await setDoc(userRef, user)
            }


            const userState = {
                handle : user.handle,
                id : userId,
            }


            dispatch(setUser(userState))

        })()
    }, [firebaseAuth])

}
