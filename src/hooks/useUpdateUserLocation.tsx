import { FormEventHandler, ChangeEventHandler, MouseEventHandler, useContext, useState, SyntheticEvent, useEffect } from "react"
import { AppContext } from "../App"
import { updateUser } from "../services/UserServices"
import Validator from "../utils/Validator"
import { User } from "../utils/types"

interface UseUpdateUserLocation { 
    handleUpdate   : FormEventHandler<HTMLFormElement>, 
    handleChange   : ChangeEventHandler<HTMLInputElement>, 
    handleReset    : MouseEventHandler<HTMLButtonElement>, 
    userLocation   : string, 
    isValidated    : boolean, 
    errorMessage   : string, 
    successMessage : string 
}

interface UseUpdateUserBioProps { 
    user : User
}

export default function useUpdateUserLocation({ user } : UseUpdateUserBioProps) : UseUpdateUserLocation {

    const appContext = useContext(AppContext)

    const [userLocation, setUserLocation]               = useState<string>('')
    const [errorMessage, setErrorMessage]     = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [isValidated, setIsValidated]       = useState<boolean>(true)


    useEffect( () => {
        ( function loadCurrentUserBio() {
            if(user?.location) setUserLocation(user.location)
        })()
    }, [user])


    function handleChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLInputElement) ) return
        setUserLocation(e.target.value)
    }


    useEffect( () => {
        ( function validate() {

            setIsValidated(false)

            if ( Validator.isTooLong(userLocation, 30) ) {
                setErrorMessage('Location must be less than 30 characters')
            
            } else if ( Validator.hasForbiddenCharacters(userLocation, Validator.regexUserLocation) ) {
                setErrorMessage('Only characters letters, numbers, spaces, hyphens, commas, and periods are allowed.')

            } else { // Validated
                setErrorMessage('')
                setIsValidated(true)
            }
        })()
    }, [userLocation])


    async function handleUpdate(e: SyntheticEvent) {
        e.preventDefault()

        if( !isValidated ) return

        const update = await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { location : userLocation }
        })

        setSuccessMessage(update.message)
    }


    function handleReset(e: SyntheticEvent) {
        console.log('hi')
        e.preventDefault()
        setUserLocation(user.location)
        setErrorMessage('')
        setIsValidated(true)
    }


    return { handleUpdate, handleChange, handleReset, userLocation, isValidated, errorMessage, successMessage }
}