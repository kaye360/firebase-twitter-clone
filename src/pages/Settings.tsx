import { useContext, useEffect, useState } from "react";
import UpdateUserBioForm from "../components/Settings/UpdateUserBioForm";
import UpdateUserHandleForm from "../components/Settings/UpdateUserHandleForm";
import { getUser, signOutUser } from "../services/UserServices";
import UpdateUserLocationForm from "../components/Settings/UpdateUserLocationForm";
import { User } from "../utils/types";
import { useNavigate } from "react-router-dom";
import Button from "../components/Layout/Button";
import Icon from "../components/Layout/Icon";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/userSlice";
import { auth } from "../../firebase-config";


export default function Settings() {
    
    
    const navigate        = useNavigate()
    const dispatch        = useDispatch()
    const [user, setUser] = useState<User | null>(null)


    useEffect( () => {

        ( async function loadCurrentUser() {
            const currentUser = await getUser(auth.currentUser?.uid)
            setUser(currentUser)
        })()
        
    }, [])


    async function signOut() : Promise<void> {
        await signOutUser()
        dispatch( clearUser() )
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



