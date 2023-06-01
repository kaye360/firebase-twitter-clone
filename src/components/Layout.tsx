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
import Lightbulb from "../assets/logo.svg"
import { Link } from "react-router-dom"
import Button from "./Button"

interface LayoutProps {
    children: ReactElement
}

export default function Layout({children }: LayoutProps) {

    const appContext = useContext(AppContext)

    return (
        <>
            <div className="grid grid-cols-[auto_1fr] gap-0 items-start  min-h-screen max-w-5xl mx-auto">

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
        <>
            <div className="flex items-center gap-4 font-bold text-2xl pl-4">
                <img src={Lightbulb} className="w-[35px]" />
                <span className="text-sky-500 font-bold">idealy</span>
            </div>
            <div className="pl-4 text-sky-600">Exchange Ideas.</div>
        </>
    )
}





function UserAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    return(
        <div className="flex items-center flex-wrap gap-2 mt-auto">

            { appContext?.firebaseAuth?.photoURL &&
                <Avatar src={appContext?.firebaseAuth?.photoURL} />
            }

            <div className="font-bold text-sky-600">
                <Link to="/profile" className="hover:underline hover:text-rose-500">
                    @{appContext?.userHandle}
                </Link>
            </div>

            <Button onClick={signOutOfGoogle} className="block w-full px-2 py-[4px] border border-sky-200 bg-sky-100 rounded-lg hover:border-sky-400 text-sky-700 justify-center">
                Sign out
            </Button>

        </div>
    )
}




function GuestAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    async function signIn() {
        const user = await signInWithGoogle()

        if( !user ) return

        appContext?.setUserHandle(user.handle)
    }

    return (
        <button onClick={signIn} className="bg-slate-200 rounded-xl px-4 py-2 mr-4 mt-auto">
            Sign in with Google
        </button>
    )
}

