import Icon from "../Icon"
import useUpdateUserHandle from "../../hooks/useUpdateUserHandle"
import ValidationIcon from "../Validation/ValidationIcon"
import ValidationError from "../Validation/ValidationError"
import Button from "../Button"



export default function UpdateUserHandleForm() {

    const userHandle = useUpdateUserHandle()
    
    return (
        <form onSubmit={ userHandle.handleUpdate }>

            <div className="grid grid-cols-[1ch_1fr_10px] items-center gap-4">
                <label htmlFor="user-handle" className="text-xl">@</label>
                <input
                    type="text"
                    value={ userHandle.userHandle } 
                    onChange={ userHandle.handleChange }
                    className="border-sky-200"
                    id="user-handle"
                />

                <ValidationIcon isValid={userHandle.isValidated} />
            </div>

            <ValidationError message={userHandle.errorMessage} />

            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    disabled={ !userHandle.isValidated }
                    className="bg-sky-100 hover:bg-fuchsia-100"
                >
                    <Icon icon="save" /> Save
                </Button>

                <Button 
                    onClick={ userHandle.handleReset } 
                    className="border border-sky-200 hover:border-fuchsia-400 font-medium"
                >
                    Reset
                </Button>

                <div>
                    { userHandle.successMessage }
                </div>
            </div>

        </form>
    )
}


