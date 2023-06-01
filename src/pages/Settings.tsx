import { useContext, useEffect, useState } from "react";
import Icon from "../components/Icon";
import UpdateUserBioForm from "../components/Settings/UpdateUserBioForm";
import UpdateUserHandleForm from "../components/Settings/UpdateUserHandleForm";
import { getUser } from "../services/UserServices";
import { AppContext } from "../App";
import UpdateUserLocationForm from "../components/Settings/UpdateUserLocationForm";
import { User } from "../utils/types";


export default function Settings() {
    
    const appContext      = useContext(AppContext)
    const [user, setUser] = useState<User | null>(null)


    useEffect( () => {
        ( async function loadCurrentUser() {
            const currentUser = await getUser(appContext?.firebaseAuth?.uid)
            setUser(currentUser)
        })()
    }, [])

    return (
        <div>
            <h1><Icon icon="settings" /> Settings</h1>

            <div className="flex flex-col gap-12 my-8">
                
                <Setting heading="Handle" htmlFor="user-handle">
                    <UpdateUserHandleForm />
                </Setting>

                <Setting heading="Bio" htmlFor="user-bio">
                    <UpdateUserBioForm user={user as User} />
                </Setting>

                <Setting heading="Location" htmlFor="user-location">
                    <UpdateUserLocationForm user={user as User} />
                </Setting>

            </div>

        </div>
    )
}



interface SettingProps {
    heading   : string,
    htmlFor   : string,
    children? : any
}

function Setting({htmlFor, heading, children} : SettingProps) {
    return (
        <div>
            <h2 className="mb-2"> 
                <label htmlFor={htmlFor}>
                    {heading}:
                </label>
            </h2>    

            {children}
        </div>
    )
}