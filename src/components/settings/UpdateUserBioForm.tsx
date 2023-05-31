import Icon from "../Icon"
import useUpdateUserBio from "../../hooks/useUpdateUserBio"
import { User } from "../../services/UserServices"


interface UpdateUserBioFormProps {
    user : User
}

export default function UpdateUserBioForm({user} : UpdateUserBioFormProps) {

    const userBio = useUpdateUserBio({user})
    
    return (
        <form onSubmit={ userBio.handleUpdate }>

            <div className="grid grid-cols-[1fr_10px] items-center gap-4">
                <textarea
                    value={ userBio.userBio } 
                    onChange={ userBio.handleChange }
                    className="border-sky-200"
                    id="user-bio"
                ></textarea>
                <div>
                    { userBio.isValidated ? (
                        <Icon icon="check_circle" className="text-emerald-400" />
                    ) : (
                        <Icon icon="error_outline" className="text-rose-400" />
                    )}
                </div>
            </div>


            <div className={` ${userBio.errorMessage ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-rose-500 py-2`}>
                <div className="overflow-hidden">
                    { userBio.errorMessage }
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={ !userBio.isValidated }
                    className={`inline-flex items-center gap-2 bg-sky-100 hover:bg-fuchsia-100 px-4 py-2 rounded-lg ${ userBio.isValidated ? '' : 'opacity-40 cursor-not-allowed'}`}
                >
                    <Icon icon="save" /> Save
                </button>

                <button onClick={ userBio.handleReset } className="bg-sky-50 hover:bg-fuchsia-50 bg-opacity-50 px-4 py-2 rounded-lg">
                    Reset
                </button>

                <div>
                    { userBio.successMessage }
                </div>
            </div>

        </form>
    )
}
