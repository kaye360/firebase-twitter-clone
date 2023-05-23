import { signInWithPopup, signOut } from "firebase/auth"
import { auth, db, googleProvider } from "../../firebase-config"
import { doc, getDoc, collection, getDocs } from "firebase/firestore"


export interface User {
	handle: string,
	avatar: string,
	notifcations : object[]
}

export interface Users {
	[key : string] : User
}


export const userCollectionRef = collection(db, "users")


export async function signInWithGoogle()  {
	try {
		let signIn = await signInWithPopup(auth, googleProvider)	
		return signIn
	} catch (error) {
		console.log(error)
		return null
	}
}

export async function signOutOfGoogle() {
	try {
		await signOut(auth)
	} catch (error) {
		console.log(error)
	}
}

export async function getUser(id: string | undefined) {

    try {
        if( !id ) return null
        const userRef = doc(db, "users", id)
        const user = await getDoc(userRef)
		return user.data()
        
    } catch (error) {
        return null
    }
}

export async function getUsers() : Promise<Users | null> {
	try {
		const usersSnap = await getDocs( userCollectionRef )

		let users : Users = {}

		usersSnap.forEach( doc => {
			users[doc.id as string] = doc.data() as User
		})

		return users
	} catch (error) {
		console.log(error)
		return null
	}
}