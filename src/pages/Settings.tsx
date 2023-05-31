import Icon from "../components/Icon";
import UpdateUserHandleForm from "../components/Settings/UpdateUserHandleForm";


export default function Settings() {

    return (
        <div>
            <h1><Icon icon="settings" /> Settings</h1>

            <div className="my-8">
                
                <h2 className="mb-2"> 
                    <label htmlFor="user-handle">
                        User Handle:
                    </label>
                </h2>

                <UpdateUserHandleForm />

            </div>

        </div>
    )
}
