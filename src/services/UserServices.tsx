import { UserCredential, signInWithPopup, signOut } from "firebase/auth"
import { auth, db, googleProvider } from "../../firebase-config"
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore"
import { ResponseSuccess, User, Users } from "../utils/types"






export const userCollectionRef = collection(db, "users")


export async function signInWithGoogle() : Promise<UserCredential | null>  {
	try {
		let signIn = await signInWithPopup(auth, googleProvider)	
		return signIn

	} catch (error) {
		return null
	}
}


export async function signOutOfGoogle() : Promise<void> {
	try {
		await signOut(auth)

	} catch (error) {
	}
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

export async function updateUser({ userId, newField } : UpdateUserProps) : Promise<ResponseSuccess> {
	try {
		const docRef = doc(db, "users", userId)

		await updateDoc(docRef, newField)
		
		return { success : true, message : 'Update successful' } as ResponseSuccess

	} catch (error) {
		return { success : false, message : 'Something went wrong...' } as ResponseSuccess
	}
}