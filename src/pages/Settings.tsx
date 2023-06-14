import { useContext, useEffect, useState } from "react";
import UpdateUserBioForm from "../components/Settings/UpdateUserBioForm";
import UpdateUserHandleForm from "../components/Settings/UpdateUserHandleForm";
import { getUser, signOutOfGoogle } from "../services/UserServices";
import { AppContext } from "../App";
import UpdateUserLocationForm from "../components/Settings/UpdateUserLocationForm";
import { User } from "../utils/types";
import { useNavigate } from "react-router-dom";
import Button from "../components/Layout/Button";
import Icon from "../components/Layout/Icon";


export default function Settings() {
    
    
    const appContext      = useContext(AppContext)
    const navigate        = useNavigate()
    const [user, setUser] = useState<User | null>(null)


    useEffect( () => {
        ( async function loadCurrentUser() {
            const currentUser = await getUser(appContext?.firebaseAuth?.uid)
            setUser(currentUser)
        })()
    }, [])


    function signOut() : void {
        signOutOfGoogle()
        appContext?.signOutUser()
        navigate('/')
    }

    

    return (
        <div>
            <h1><Icon icon="settings" /> Settings</h1>

            <div className="grid gap-12 my-8">
                
                <UpdateUserHandleForm />

                <UpdateUserBioForm user={user as User} />

                <UpdateUserLocationForm user={user as User} />

                <div>
                    <h2 className="mb-2">
                        Sign out of your account:
                    </h2>

                    <Button onClick={signOut} className="bg-blue-100 hover:bg-fuchsia-100">
                        <Icon icon="logout" />
                        Sign out
                    </Button>
                </div>

            </div>

        </div>
    )
}



