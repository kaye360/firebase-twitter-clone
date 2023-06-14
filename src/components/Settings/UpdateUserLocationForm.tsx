import { User } from "../../utils/types"
import Button from "../Layout/Button"
import Icon from "../Layout/Icon"
import { MouseEventHandler, useContext, useState, useEffect, SyntheticEvent, Dispatch, SetStateAction } from "react"
import { AppContext } from "../../App"
import { updateUser } from "../../services/UserServices"
import ValidatedForm from "../ValidatedForm/components/ValidatedForm"
import { MAX_USER_LOCATION_LENGTH } from "../../utils/appConfig"
import ValidatedField from "../ValidatedForm/components/ValidatedField"
import ValidatorRules from "../ValidatedForm/utils/ValidatorRules"
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../ValidatedForm/components/SubmitSuccessMessage"


interface UpdateUserLocationFormProps {
    user : User
}

export default function UpdateUserLocationForm({user} : UpdateUserLocationFormProps) {


    const [userLocation, setUserLocation]   = useState<string>('')
    const { handleFormSubmit, handleReset } = useUpdateUserLocation({ user, userLocation, setUserLocation })

    
    return (
        <ValidatedForm
            handleSubmit={handleFormSubmit}
            config={{successMessage : 'Location updated.'}}
            rules={{}}
        >

            <h2 className="flex justify-between my-2">
                Location:
                <span className={`font-normal ${userLocation.length > MAX_USER_LOCATION_LENGTH ? 'text-red-400' : ''}`}>
                    {userLocation.length} / {MAX_USER_LOCATION_LENGTH}
                </span>
            </h2>

            <ValidatedField 
                title={"Location"} 
                value={userLocation} 
                setValue={setUserLocation} 
                type={"text"} 
                rules={{
                    maxLength : MAX_USER_LOCATION_LENGTH,
                    allowableChars : {
                        regex : ValidatorRules.regexUserLocation,
                        chars : 'letters, numbers, spaces, and .-, characters'
                    }
                }}                
            />


            <SubmitErrorMessage />
            <SubmitSuccessMessage />

            <div className="flex items-center gap-4 mt-2">

                <Button
                    type="submit"
                    className="bg-blue-100 hover:bg-fuchsia-100"
                >
                    <Icon icon="save" /> Save
                </Button>

                <Button 
                    onClick={ handleReset } 
                    className="border border-blue-200 hover:border-fuchsia-400"
                >
                    Reset
                </Button>

            </div>

        </ValidatedForm>
    )
}





interface UseUpdateUserLocation { 
    handleFormSubmit : Function, 
    handleReset      : MouseEventHandler<HTMLButtonElement>,
}

interface UseUpdateUserBioProps { 
    user : User,
    userLocation : string, 
    setUserLocation : Dispatch<SetStateAction<string>>,
}

function useUpdateUserLocation({ user, userLocation, setUserLocation } : UseUpdateUserBioProps) : UseUpdateUserLocation {


    const appContext = useContext(AppContext)


    useEffect( () => {
        ( function loadCurrentUserLocation() {
            if(user?.location) setUserLocation(user.location)
        })()
    }, [user])


    async function handleFormSubmit() {

        await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { location : userLocation }
        })
    }


    function handleReset(e: SyntheticEvent) {
        e.preventDefault()
        setUserLocation(user.location)
    }


    return { handleFormSubmit, handleReset }
}