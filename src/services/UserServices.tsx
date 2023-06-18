import { getAuth, signInAnonymously, signInWithPopup, signOut } from "firebase/auth"
import { auth, db, googleProvider } from "../../firebase-config"
import { doc, getDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore"
import { AsynchronousResponse, User, Users } from "../utils/types"
import { AsyncResponse } from "../utils/AsyncResponse"




export const userCollectionRef = collection(db, "users")




export async function signInWithGoogle() : Promise<void>  {

	await signInWithPopup(auth, googleProvider)	

}




export async function signInAsGuest()  : Promise<void>  {

	await signInAnonymously(auth)

}




export async function signOutUser() : Promise<void> {

	await signOut(auth)

}




export async function getUser(id: string | undefined) : Promise<User | null> {
    try {
        if( !id ) return null

        const userRef = doc(db, "users", id)
        const user 	  = await getDoc(userRef)

		return user.data() as User | null
        
    } catch (error) {
        return null
    }
}




export async function getUsers() : Promise<Users | null> {
	try {
		const usersSnap   = await getDocs( userCollectionRef )
		let users : Users = {}

		usersSnap.forEach( doc => {
			users[doc.id as string] = doc.data() as User
		})

		return users

	} catch (error) {
		return null
	}
}




export async function getAllUserHandles() : Promise<string[] | null> {
	try {
		const usersSnap 	 = await getDocs( userCollectionRef )
		let users : string[] = []

		usersSnap.forEach( doc => {
			users.push(doc.data().handle)
		})

		return users
		
	} catch (error) {
		return null
	}
}




export interface UpdateUserProps {
	userId   : string,
	newField : {
		[key: string] : any
	}
}




export async function updateUser({ userId, newField } : UpdateUserProps) : Promise<AsynchronousResponse> {
	try {
		const docRef = doc(db, "users", userId)

		await updateDoc(docRef, newField)
		
		return AsyncResponse.success({message : 'Update successful.'})

	} catch (error) {
		return AsyncResponse.success({message : 'Something went wrong.'})
	}
}