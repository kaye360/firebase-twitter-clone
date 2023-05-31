import { FormEventHandler, ChangeEventHandler, MouseEventHandler, useContext, useState, SyntheticEvent, useEffect } from "react"
import { AppContext } from "../App"
import { getAllUserHandles, updateUser } from "../services/UserServices"

interface UseUpdateUserHandle { 
    handleUpdate   : FormEventHandler<HTMLFormElement>, 
    handleChange   : ChangeEventHandler<HTMLInputElement>, 
    handleReset    : MouseEventHandler<HTMLButtonElement>, 
    userHandle     : string, 
    isValidated    : boolean, 
    errorMessage   : string, 
    successMessage : string 
}

export default function useUpdateUserHandle() : UseUpdateUserHandle {

    const appContext = useContext(AppContext)

    const [userHandle, setUserHandle]         = useState<string>('')
    const [errorMessage, setErrorMessage]     = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [isValidated, setIsValidated]       = useState<boolean>(true)
    const [all, setAll]                       = useState<string[]>([''])

    const regex = /^[a-zA-Z0-9._-]+$/


    function handleChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLInputElement) ) return
        setUserHandle(e.target.value)
    }


    useEffect( () => {
        ( function validate() {
            const isEmpty                = userHandle.length === 0
            const isTooLong              = userHandle.length > 15
            const hasForbiddenCharacters = !regex.test(userHandle)
            const isTaken                = all.includes(userHandle) && userHandle !== appContext?.userHandle

            setIsValidated(false)

            if ( isEmpty ) {
                setErrorMessage('Please enter a user handle')
                
            } else if ( isTooLong ) {
                setErrorMessage('Username must be less than 15 characters')
                
            } else if ( hasForbiddenCharacters ) {
                setErrorMessage('Only characters letters, numbers, -, _, and . are allowed')
                
            } else if( isTaken ) {
                setErrorMessage('This user handle is already taken')
                
            } else { // Validated
                setErrorMessage('')
                setIsValidated(true)
            }
        })()
    }, [userHandle])


    useEffect( () => {
        ( async function loadAllUserHandles() {
            const handlesList = await getAllUserHandles()
            if(handlesList) setAll(handlesList)
        })();
    }, [])


    useEffect( () => {
        ( function setInputToCurrentUserHandle () {
            if(appContext?.userHandle) setUserHandle(appContext?.userHandle)
        })()
    }, [appContext?.userHandle])


    async function handleUpdate(e: SyntheticEvent) {
        e.preventDefault()

        if( !isValidated ) return

        const update = await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { handle : userHandle }
        })

        setSuccessMessage(update.message)

        if( update.success ) {
            appContext?.setUserHandle(userHandle)
        }
    }


    function handleReset(e: SyntheticEvent) {
        e.preventDefault()
        setUserHandle(appContext?.userHandle as string)
        setErrorMessage('')
        setIsValidated(true)
    }


    return { handleUpdate, handleChange, handleReset, userHandle, isValidated, errorMessage, successMessage }
}