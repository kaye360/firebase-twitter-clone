import { ReactElement, useContext } from "react"
import { signInWithGoogle, signOutOfGoogle } from "../services/UserServices"
import { AppContext } from "../App"
import Modal from "../modals/Modal"
import Avatar from "./Avatar"
import { ErrorBoundary } from "react-error-boundary"
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
            <div className="static md:grid md:grid-cols-[auto_1fr] gap-0 items-start min-h-screen max-w-5xl mx-auto">

                <nav className="static md:sticky md:top-0 md:p-4 md:flex md:flex-col md:h-screen bg-white bg-opacity-40">

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

                <main className="min-h-screen p-2 md:px-8 md:py-4 bg-white bg-opacity-70">
                    <ErrorBoundary fallback={<div>Something went wrong...</div>}>
                        {children}
                    </ErrorBoundary>
                </main>

            </div>

            <footer className="bg-sky-700 text-white mb-12 md:mb-0 py-16 text-center">
                <p>
                    Made by Josh Kaye.
                </p>
                <p>
                    <a href="https://joshkaye.dev" className="underline hover:text-rose-400">Portfolio</a>
                </p>
                <p>
                    <a href="https://github.com/kaye360/" className="underline hover:text-rose-400">GitHub</a>
                </p>
            </footer>

            <Modal content={appContext?.modal} />
        </>
    )
}




function Logo() : JSX.Element {
    return (
        <div className="bg-sky-100 py-4 md:p-0 md:bg-transparent md:static ">
            <div className="flex items-center gap-4 font-bold text-2xl pl-4">
                <img src={Lightbulb} className="w-[35px]" />
                <span className="text-sky-500 font-bold">idealy</span>
            </div>
        </div>
    )
}





function UserAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    return(
        <div className="absolute top-[8px] right-4 md:static flex items-center flex-row-reverse md:flex-row gap-2 mt-auto">

            { appContext?.firebaseAuth?.photoURL &&
                <Avatar src={appContext?.firebaseAuth?.photoURL} />
            }

            <div className="font-bold text-sky-600">
                <Link to="/profile" className="hover:underline hover:text-rose-500">
                    @{appContext?.userHandle}
                </Link>
            </div>

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
        <Button 
            onClick={signIn} 
            className="absolute top-[8px] right-4 md:static bg-blue-200 hover:bg-rose-200 mt-auto justify-center"
        >
            Sign In
        </Button>
    )
}

