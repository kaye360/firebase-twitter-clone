import { useContext } from "react"
import { NavLink as RouterLink } from "react-router-dom"
import { AppContext } from "../App"
import CreatePost from "../modals/CreatePost"
import Icon from "./Icon"



export default function NavLinks() {

    const appContext = useContext(AppContext)
    const profilePath = '/profile/' + appContext?.firebaseAuth?.uid

    return (
        <NavWrapper>
            <NavLink to="/feed"            icon="view_agenda">   Feed         </NavLink>
            <NavLink to="/explore"         icon="explore">       Explore      </NavLink>
            <NavLink to="/notifications"   icon="notifications"> Notifications</NavLink>
            <NavLink to={`${profilePath}`} icon="account_circle">Profile      </NavLink>
            <NavLink to="/about"           icon="description">   About        </NavLink>
            <NavLink to="/settings"        icon="settings">      Settings     </NavLink>
            <CreatePostBtn />
        </NavWrapper>
    )
}




function NavWrapper({children} : {children : JSX.Element[]}) {
    return (
        <ul className="flex flex-col gap-0 mt-4 text-md">{children}</ul>
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
            <RouterLink to={to} className={`flex items-center w-full px-4 py-4 gap-4 hover:bg-orange-100 rounded-xl ${className}`}>
                <Icon icon={icon} />
                {children}
            </RouterLink>
        </li>
    )
}




function CreatePostBtn() {

    const appContext = useContext(AppContext)

    return (
        <li>
            <button 
                className="flex items-center gap-2 justify-center mt-2 bg-sky-100 w-full p-2 rounded-xl hover:bg-teal-100"
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