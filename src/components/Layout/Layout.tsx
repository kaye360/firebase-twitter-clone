import { ReactElement, useContext, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import NavLinks from "./NavLinks"
import { Link } from "react-router-dom"
import Button from "./Button"
import QuarkSvgLogo from "./QuarkSvgLogo"
import { AppContext } from "../../App"
import Modal from "../../modals/Modal"
import { signInAsGuest, signInWithGoogle } from "../../services/UserServices"
import Avatar from "./Avatar"
import Icon from "./Icon"


interface LayoutProps {
    children: ReactElement
}

export default function Layout({children }: LayoutProps) {

    const appContext = useContext(AppContext)

    return (
        <>
            <div className="relative border md:grid md:grid-cols-[auto_1fr] gap-0 items-start min-h-screen max-w-5xl mx-auto">

                <nav className="static md:sticky md:top-0 md:p-4 md:flex md:flex-col md:h-screen bg-white bg-opacity-40">

                    <Link to="/" className="hover:animate-ping ">
                        <Logo />
                    </Link>

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

            <footer className="bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-800 to-indigo-900 text-white pt-16 pb-32 md:pb-16">

                <div className="flex items-start justify-center gap-12 mx-auto">

                    <div className="flex items-center gap-4">
                        <Link to="/">
                            <QuarkSvgLogo className="scale-[1.5]" strokeClassName="stroke-white" fillClassName="fill-white" />
                        </Link>
                        Quark<br />
                        Made by Josh Kaye.
                    </div>

                    <div>
                        <p>
                            <a href="https://joshkaye.dev" className="underline hover:text-rose-400">Portfolio</a>
                        </p>
                        <p>
                            <a href="https://github.com/kaye360/" className="underline hover:text-rose-400">GitHub</a>
                        </p>
                    </div>

                </div>

            </footer>

            <Modal content={appContext?.modal} />
        </>
    )
}




function Logo() : JSX.Element {
    return (
        <div className="bg-blue-100 py-4 md:p-0 md:bg-transparent md:static ">
            <div className="flex items-center gap-4 font-bold text-2xl pl-4">
                <QuarkSvgLogo />
                <span className="text-blue-500 font-bold">Quark</span>
            </div>
        </div>
    )
}





function UserAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    return(
        <div className="absolute top-[8px] right-4 md:static flex items-center flex-row-reverse md:flex-row gap-2 mt-auto">

            <Avatar src={appContext?.firebaseAuth?.photoURL || null} />

            <div className="font-bold text-blue-600">
                <Link to="/profile" className="hover:underline hover:text-rose-500">
                    @{appContext?.userHandle}
                </Link>
            </div>

        </div>
    )
}




function GuestAvatar() : JSX.Element {

    const appContext = useContext(AppContext)

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true)


    async function signIn() {

        const user = await signInWithGoogle()
        if( !user ) return
        appContext?.setUserHandle(user.handle)
    }

    
    async function handleSignInAsGuest() {

        const user = await signInAsGuest()
        if( !user ) return
        appContext?.setUserHandle(user.handle)
    }


    return (
        <div className="absolute top-[8px] right-4 z-50 md:static mt-auto">
        
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mb-2 bg-blue-100 bg-opacity-60 w-full justify-end md:justify-between">
                Sign in
                <Icon icon="expand_less" className={` ${isMenuOpen ? 'rotate-0 md:rotate-[540deg]' :  'rotate-[540deg] md:rotate-0'} transition-all duration-1000 `} />
            </Button>

            <div className={` 
                ${isMenuOpen ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'} 
                transition-[grid-template-rows] duration-200
            `}>

                <div className="overflow-hidden grid gap-2">

                    <Button 
                        onClick={signIn} 
                        className={`font-normal py-2 justify-end md:justify-start border border-blue-200 transition-all duration-[750ms] bg-blue-50 md:bg-none ${!isMenuOpen ? '-translate-y-8 md:translate-y-8' : ''} `}
                    >
                        Google Account
                    </Button>

                    <Button 
                        onClick={handleSignInAsGuest}
                        className={`font-normal py-2 justify-end md:justify-start border border-blue-200 transition-all duration-[750ms] bg-blue-50 md:bg-none ${!isMenuOpen ? '-translate-y-16 md:translate-y-16' : ''} `}
                    >
                        Guest Account
                    </Button>

                </div>

            </div>

        </div>
    )
}

