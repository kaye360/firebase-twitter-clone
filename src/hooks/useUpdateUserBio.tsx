import { FormEventHandler, ChangeEventHandler, MouseEventHandler, useContext, useState, SyntheticEvent, useEffect } from "react"
import { AppContext } from "../App"
import { updateUser } from "../services/UserServices"
import Validator from "../utils/Validator"
import { User } from "../utils/types"

interface UseUpdateUserBio { 
    handleUpdate   : FormEventHandler<HTMLFormElement>, 
    handleChange   : ChangeEventHandler<HTMLTextAreaElement>, 
    handleReset    : MouseEventHandler<HTMLButtonElement>, 
    userBio        : string, 
    isValidated    : boolean, 
    errorMessage   : string, 
    successMessage : string 
}

interface UseUpdateUserBioProps { 
    user : User
}

export default function useUpdateUserBio({ user } : UseUpdateUserBioProps) : UseUpdateUserBio {

    const appContext = useContext(AppContext)

    const [userBio, setUserBio]               = useState<string>('')
    const [errorMessage, setErrorMessage]     = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [isValidated, setIsValidated]       = useState<boolean>(true)


    useEffect( () => {
        ( function loadCurrentUserBio() {
            if(user?.bio) setUserBio(user.bio)
        })()
    }, [user])


    function handleChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLTextAreaElement) ) return
        setUserBio(e.target.value)
    }


    useEffect( () => {
        ( function validate() {

            setIsValidated(false)

            if ( Validator.isTooLong(userBio, 200) ) {
                setErrorMessage('Bio must be less than 200 characters')
                
            } else { // Validated
                setErrorMessage('')
                setIsValidated(true)
            }
        })()
    }, [userBio])


    async function handleUpdate(e: SyntheticEvent) {
        e.preventDefault()

        if( !isValidated ) return

        const update = await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { bio : userBio }
        })

        setSuccessMessage(update.message)
    }


    function handleReset(e: SyntheticEvent) {
        console.log('hi')
        e.preventDefault()
        setUserBio(user.bio)
        setErrorMessage('')
        setIsValidated(true)
    }


    return { handleUpdate, handleChange, handleReset, userBio, isValidated, errorMessage, successMessage }
}