import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../App"
import CreatePost from "../modals/CreatePost"
import Icon from "./Icon"
import Button from "./Button"



export default function NavLinks() {

    const appContext = useContext(AppContext)

    return (
        <NavWrapper>
            <NavLink to="/explore" icon="explore">    Explore</NavLink>
            <NavLink to="/about" icon="description">About  </NavLink>
            <NavSpacer />

            { appContext?.firebaseAuth &&
                <div>
                    <NavLink to="/notifications" icon="notifications">Notifications</NavLink>
                    <NavLink to="/profile"  icon="account_circle">    Profile      </NavLink>
                    <NavLink to="/settings" icon="settings">          Settings     </NavLink>
                    <NavSpacer />
                </div>
            }

            <CreatePostBtn />
        </NavWrapper>
    )
}




function NavWrapper({children} : {children : any}) {
    return (
        <ul className="flex flex-col gap-0 mt-4 text-md text-sky-600">{children}</ul>
    )
}





interface NavLinkProps {
    to         : string,
    icon       : string,
    className? : string,
    children   : string
}

function NavLink({to, icon, className = '', children} :  NavLinkProps) {
    return (
        <li>
            <Link to={to} className={`nav-link flex items-center w-full px-4 py-3 gap-4 font-bold hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-200 transition-all duration-100 ${className}`}>
                <Icon icon={icon}  className="nav-icon"/>
                {children}
            </Link>
        </li>
    )
}




function CreatePostBtn() {

    const appContext = useContext(AppContext)

    return (
        <li>
            <Button 
                className="relative mt-2 h-12 bg-gradient-to-br from-sky-200 via-rose-200 to-sky-200  text-sky-600 font-bold w-full rounded-lg hover:bg-rose-500 transition-all duration-100"
                onClick={ () => {
                    appContext?.setModal(<CreatePost closeModal={appContext.closeModal} />)
                }}
            >
                <span className="absolute inset-[2px] flex items-center gap-2 justify-center rounded-md bg-gradient-to-br from-sky-50 to-rose-50 via-sky-50 hover:from-rose-100 hover:to-rose-100 hover:via-sky-100 transition-all">
                    Add Post
                    <Icon icon="add_comment" className="rotate-y-180" />
                </span>
            </Button>
        </li>
    )
}



function NavSpacer() {
    return (
        <div className="h-[1px] my-2 bg-sky-100"></div>
    )
}