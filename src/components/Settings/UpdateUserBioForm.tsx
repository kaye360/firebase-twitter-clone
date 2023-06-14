import { User } from "../../utils/types"
import Button from "../Layout/Button"
import Icon from "../Layout/Icon"
import { MouseEventHandler, useContext, useState, useEffect, SyntheticEvent, Dispatch, SetStateAction } from "react"
import { AppContext } from "../../App"
import { updateUser } from "../../services/UserServices"
import ValidatedForm from "../ValidatedForm/components/ValidatedForm"
import ValidatedField from "../ValidatedForm/components/ValidatedField"
import { MAX_USER_BIO_LENGTH } from "../../utils/appConfig"
import SubmitSuccessMessage from "../ValidatedForm/components/SubmitSuccessMessage"
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage"


interface UpdateUserBioFormProps {
    user : User
}

export default function UpdateUserBioForm({user} : UpdateUserBioFormProps) {

    const [userBio, setUserBio] = useState<string>('')
    const { handleFormSubmit, handleReset } = useUpdateUserBio({ user, userBio, setUserBio })
    

    return (
        <ValidatedForm 
            handleSubmit={handleFormSubmit}
            rules={{auth : true}}
            config={{successMessage : 'Bio updated.'}}
        >

            <h2 className="flex justify-between my-2">
                Bio:
                <span className={userBio.length > MAX_USER_BIO_LENGTH ? 'text-red-400' : ''}>
                    {userBio.length} / {MAX_USER_BIO_LENGTH}
                </span>
            </h2>

            <ValidatedField
                title="User Bio"
                type="textarea"
                value={userBio}
                setValue={setUserBio}
                rules={{maxLength : MAX_USER_BIO_LENGTH}}
            />

            <SubmitErrorMessage />
            <SubmitSuccessMessage />

            <div className="flex items-center gap-4">
                <Button
                    type="submit"
                    className="bg-blue-100 hover:bg-fuchsia-100"
                >
                    <Icon icon="save" /> Save
                </Button>

                <Button 
                    onClick={ handleReset } 
                    className="border border-blue-200 hover:border-fuchsia-400 font-medium"
                >
                    Reset
                </Button>

            </div>

        </ValidatedForm>
    )
}




interface UseUpdateUserBio { 
    handleFormSubmit : Function, 
    handleReset      : MouseEventHandler<HTMLButtonElement>,
}

interface UseUpdateUserBioProps { 
    user       : User,
    userBio    : string,
    setUserBio : Dispatch<SetStateAction<string>>,
}

function useUpdateUserBio({ user, userBio, setUserBio } : UseUpdateUserBioProps) : UseUpdateUserBio {


    const appContext = useContext(AppContext)


    useEffect( () => {
        ( function loadCurrentUserBio() {
            if(user?.bio) setUserBio(user.bio)
        })()
    }, [user])



    async function handleFormSubmit() {

        await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { bio : userBio }
        })
    }


    function handleReset(e: SyntheticEvent) {
        e.preventDefault()
        setUserBio(user.bio)
    }


    return { handleFormSubmit, handleReset }
}