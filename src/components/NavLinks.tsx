import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../App"
import CreatePost from "../modals/CreatePost"
import Icon from "./Icon"



export default function NavLinks() {

    return (
        <NavWrapper>
            <NavLink to="/explore"         icon="explore">       Explore      </NavLink>
            <NavLink to="/notifications"   icon="notifications"> Notifications</NavLink>
            <NavLink to="/profile"         icon="account_circle">Profile      </NavLink>
            <NavLink to="/about"           icon="description">   About        </NavLink>
            <NavLink to="/settings"        icon="settings">      Settings     </NavLink>
            <CreatePostBtn />
        </NavWrapper>
    )
}




function NavWrapper({children} : {children : JSX.Element[]}) {
    return (
        <ul className="flex flex-col gap-0 mt-4 text-md text-sky-800">{children}</ul>
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
            <Link to={to} className={`nav-link flex items-center w-full px-4 py-4 gap-4 font-bold hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-200 transition-all duration-100 ${className}`}>
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
            <button 
                className="flex items-center gap-2 justify-center mt-2 bg-sky-400 text-white font-bold w-full p-2 rounded-xl hover:bg-rose-500 transition-all duration-100"
                onClick={ () => {
                    appContext?.setModal(<CreatePost closeModal={appContext.closeModal} />)
                }}
            >
                <Icon icon="add" />
                Add Post
            </button>
        </li>
    )
}