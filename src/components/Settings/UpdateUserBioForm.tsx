import Icon from "../Icon"
import useUpdateUserBio from "../../hooks/useUpdateUserBio"
import { User } from "../../services/UserServices"
import Validator from "../../utils/Validators"
import ValidationIcon from "../Validation/ValidationIcon"
import ValidationError from "../Validation/ValidationError"
import Button from "../Button"


interface UpdateUserBioFormProps {
    user : User
}

export default function UpdateUserBioForm({user} : UpdateUserBioFormProps) {

    const userBio = useUpdateUserBio({user})
    
    return (
        <form onSubmit={ userBio.handleUpdate }>

            <div className="relative grid grid-cols-[1fr_10px] items-center gap-4">

                <div className="absolute right-[30px] top-[-2rem]">
                    <span className={Validator.isTooLong(userBio.userBio, 200) ? 'text-red-400' : ''}>
                        {userBio.userBio.length} / 200
                    </span>
                </div>

                <textarea
                    value={ userBio.userBio } 
                    onChange={ userBio.handleChange }
                    className="border-sky-200 h-24"
                    id="user-bio"
                ></textarea>

                <ValidationIcon isValid={userBio.isValidated} />

            </div>

            <ValidationError message={userBio.errorMessage} />

            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    disabled={ !userBio.isValidated }
                    className="bg-sky-100 hover:bg-fuchsia-100"
                >
                    <Icon icon="save" /> Save
                </Button>

                <Button 
                    onClick={ userBio.handleReset } 
                    className="border border-sky-200 hover:border-fuchsia-400 font-medium"
                >
                    Reset
                </Button>

                <div>
                    { userBio.successMessage }
                </div>
            </div>

        </form>
    )
}
