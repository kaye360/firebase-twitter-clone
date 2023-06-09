import Icon from "../Icon"
import Validator from "../../utils/validators/Validator"
import ValidationIcon from "../Validation/ValidationIcon"
import ValidationError from "../Validation/ValidationError"
import Button from "../Button"
import useUpdateUserLocation from "../../hooks/useUpdateUserLocation"
import { User } from "../../utils/types"


interface UpdateUserLocationFormProps {
    user : User
}

export default function UpdateUserLocationForm({user} : UpdateUserLocationFormProps) {

    const userLocation = useUpdateUserLocation({user})
    
    return (
        <form onSubmit={ userLocation.handleUpdate }>

            <div className="relative grid grid-cols-[1fr_20px] items-center gap-4">

                <div className="absolute right-[30px] top-[-2rem]">
                    <span className={Validator.isTooLong(userLocation.userLocation, 30) ? 'text-red-400' : ''}>
                        {userLocation.userLocation.length} / 30
                    </span>
                </div>

                <input
                    value={ userLocation.userLocation } 
                    onChange={ userLocation.handleChange }
                    className="border-blue-200"
                    id="user-location"
                />

                <ValidationIcon isValid={userLocation.isValidated} />

            </div>

            <ValidationError message={userLocation.errorMessage} />

            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    disabled={ !userLocation.isValidated }
                    className="bg-blue-100 hover:bg-fuchsia-100"
                >
                    <Icon icon="save" /> Save
                </Button>

                <Button 
                    onClick={ userLocation.handleReset } 
                    className="border border-blue-200 hover:border-fuchsia-400 font-medium"
                >
                    Reset
                </Button>

                <div>
                    { userLocation.successMessage }
                </div>
            </div>

        </form>
    )
}
