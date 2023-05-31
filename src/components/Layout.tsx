import { ReactElement, useContext } from "react"
import { signInWithGoogle, signOutOfGoogle } from "../services/UserServices"
import { AppContext } from "../App"
import Modal from "../modals/Modal"
import Avatar from "./Avatar"
import { ErrorBoundary } from "react-error-boundary"
import { UserCredential } from "firebase/auth/react-native"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../firebase-config"
import NavLinks from "./NavLinks"
import Icon from "./Icon"

interface LayoutProps {
    children: ReactElement
}

export default function Layout({children }: LayoutProps) {

    const appContext = useContext(AppContext)

    return (
        <>
            <div className="grid grid-cols-[300px_1fr] gap-0 items-start  min-h-screen max-w-5xl mx-auto">

                <nav className="sticky top-0 p-4 flex flex-col h-screen bg-white bg-opacity-40">

                    <Logo />

                    <NavLinks />

                    <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                        {appContext?.firebaseAuth ? (
                            <UserAvatar />
                        ) : (
                            <GuestAvatar />
                        )}
                    </ErrorBoundary>

                </nav>

                <main className="min-h-screen px-8 py-4 bg-white bg-opacity-70">
                    <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                        {children}
                    </ErrorBoundary>
                </main>

            </div>

            <footer className="col-span-2 bg-fuchsia-100 py-24 text-center">
                    footer
            </footer>

            <Modal content={appContext?.modal} />
        </>
    )
}




function Logo() : JSX.Element {
    return (
        <div className="flex items-center font-bold text-lg pl-4">
            <Icon icon="rocket_launch" className="mr-2" />
            <span className="text-sky-600">Postify</span>
        </div>
    )
}





function UserAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    return(
        <div className="flex items-center justify-between flex-wrap gap-4 mt-auto">
            <div>
                @{appContext?.userHandle}
            </div>

            { appContext?.firebaseAuth?.photoURL &&
                <Avatar src={appContext?.firebaseAuth?.photoURL} />
            }

            <button onClick={signOutOfGoogle} className="block w-full border border-sky-200 rounded-lg hover:border-sky-400">
                Sign out
            </button>
        </div>
    )
}




function GuestAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    async function signIn() {
        const signIn: UserCredential | null = await signInWithGoogle()

        if( !signIn ) return

        const username : string | undefined = signIn.user.email?.split('@')[0].substring(0,15)
        const userId : string | null        = signIn.user.uid
        const avatar : string | null        = signIn.user.photoURL
    
        const userRef  = doc(db, "users", userId)
        const userSnap = await getDoc(userRef)

        if( !userSnap.exists() ) {
            
            // Create a new user in users collection
            await setDoc(userRef, {
                handle        : username,
                avatar        : avatar,
                notifications : []
            })
        }

        appContext?.setUserHandle(username as string)
    }

    return (
        <button onClick={signIn} className="bg-slate-200 rounded-xl px-4 py-2 mr-4 mt-auto">
            Sign in with Google
        </button>
    )
}

