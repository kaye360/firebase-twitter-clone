import { doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { auth, db } from "../../firebase-config"
import { User } from "../utils/types"
import { setUser } from "../slices/userSlice"
import { useAuthState } from "react-firebase-hooks/auth"

export default function useAuth() {

    const [firebaseAuth] = useAuthState(auth);

    const dispatch = useDispatch()
    
    let userId: string = ''
    

    useEffect( () => {
        
        ( async function loadUser() {

            if( !firebaseAuth || typeof auth.currentUser?.uid !== 'string' ) return

            /**
             * Get current user
             */
            userId         = auth.currentUser?.uid
            const userRef  = doc(db, "users", userId)
            const userSnap = await getDoc(userRef)
            let user 	   = userSnap.data() as User
    

            /**
             * If no user exists, create one
             * If user is signing up as a guest, generate a random username
             * Else if user is signing in with google, use their email handle as username
             */
            if( !userSnap.exists() ) {

                const handle: string = auth.currentUser.isAnonymous
                    ? 'guest_' + crypto.randomUUID().slice(0,5)
                    : auth.currentUser.email?.split('@')[0].substring(0,15) as string

                if( typeof handle !== 'string') throw 'Error creating user handle'
                
                // Create a new user in users collection if not already created
                user = {
                    handle,
                    avatar			 : auth.currentUser.photoURL as string, 
                    bio 			 : 'Hi! I\'m new to this app.',
                    location 		 : 'Earth',
                    notificationsNew : [],
                    notificationsOld : [],
                }
                await setDoc(userRef, user)
            }


            /**
             * Update user slice
             */
            const userState = {
                handle : user.handle,
                id : userId,
            }

            dispatch(setUser(userState))

        })()
    }, [firebaseAuth])

}
