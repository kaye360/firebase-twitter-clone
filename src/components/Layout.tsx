import { ReactElement, useContext } from "react"
import { signInWithGoogle, signOutOfGoogle } from "../services/UserServices"
import { AppContext } from "../App"
import { NavLink } from "react-router-dom"
import CreatePost from "../modals/CreatePost"
import Modal from "../modals/Modal"
import Avatar from "./Avatar"
import { ErrorBoundary } from "react-error-boundary"
import { UserCredential } from "firebase/auth/react-native"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../firebase-config"

interface LayoutProps {
    children: ReactElement
}

export default function Layout({children }: LayoutProps) {

    const appContext = useContext(AppContext)

    return (
        <>
            <div className="grid grid-cols-[250px_1fr] gap-4 items-start  min-h-screen max-w-7xl mx-auto">

                <nav className="sticky top-0 p-4 flex flex-col h-screen">

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

                <main className="p-4">
                    <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                        {children}
                    </ErrorBoundary>
                </main>

            </div>

            <footer className="col-span-2 bg-fuchsia-100 py-24 text-center">
                    footy
            </footer>

            <Modal content={appContext?.modal} />
        </>
    )
}




function Logo() : JSX.Element {
    return (
        <div>
            <span className="text-sky-400">Social</span>
            <span className="text-red-400">Media</span>
            <span className="text-green-400">App</span>
        </div>
    )
}




function NavLinks() : JSX.Element {

    const appContext = useContext(AppContext)
    
    return (
        <ul className="flex flex-col gap-2">
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            <li>
                <NavLink to="/feed">Feed</NavLink>
            </li>
            <li>
                <NavLink to="/explore">Explore</NavLink>
            </li>
            <li>
                <NavLink to="/notifications">Notifications</NavLink>
            </li>
            <li>
                <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
                <NavLink to="/about">About</NavLink>
            </li>
            <li>
                <button 
                    className="bg-sky-200 w-full p-4 rounded-3xl hover:bg-rose-200"
                    onClick={ () => {
                        appContext?.setModal(<CreatePost closeModal={appContext.closeModal} />)
                    }}
                >
                    Add Post
                </button>
            </li>
        </ul>
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

            <button onClick={signOutOfGoogle} className="border border-slate-400 rounded-xl px-2 py-2 w-full">
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
        const userId : string | null = signIn.user.uid
        const avatar : string | null = signIn.user.photoURL
    
        const userRef = doc(db, "users", userId)
        const userSnap = await getDoc(userRef)

        if( !userSnap.exists() ) {
            // Create a new user in users collection
            
            await setDoc(userRef, {
                handle : username,
                avatar : avatar,
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

