import { useContext, useState, SyntheticEvent, useEffect, FormEventHandler, ChangeEventHandler, MouseEventHandler } from "react"
import { AppContext } from "../../App"
import { getAllUserHandles, updateUser } from "../../services/UserServices"
import Icon from "../Icon"

export default function UpdateUserHandleForm() {

    
    const userHandle = useUpdateUserHandle()
    
    return (
        <form onSubmit={ userHandle.handleUpdate }>

            <div className="grid grid-cols-[1ch_1fr_10px] items-center gap-4">
                <label htmlFor="user-handle" className="text-xl">@</label>
                <input
                    type="text"
                    value={ userHandle.userHandle } onChange={ userHandle.handleChange }
                    className="border-sky-200 focus-visible:outline-sky-400"
                    id="user-handle"
                />
                <div>
                    { userHandle.isValidated ? (
                        <Icon icon="check_circle" className="text-emerald-400" />
                    ) : (
                        <Icon icon="error_outline" className="text-rose-400" />
                    )}
                </div>
            </div>

            <div className="text-rose-500 min-h-min transition-all duration-200">{ userHandle.errorMessage }</div>

            <div className="flex items-center gap-4 mt-4">
                <button
                    type="submit"
                    disabled={ !userHandle.isValidated }
                    className={`inline-flex items-center gap-2 bg-sky-100 hover:bg-fuchsia-100 px-4 py-2 rounded-lg ${ userHandle.isValidated ? '' : 'opacity-40 cursor-not-allowed'}`}
                >
                    <Icon icon="save" /> Save
                </button>

                <button onClick={ userHandle.handleReset } className="bg-sky-50 hover:bg-fuchsia-50 bg-opacity-50 px-4 py-2 rounded-lg">
                    Reset
                </button>

                <div>
                    { userHandle.successMessage }
                </div>
            </div>

        </form>
    )
}



interface UseUpdateUserHandle { 
    handleUpdate : FormEventHandler<HTMLFormElement>, 
    handleChange : ChangeEventHandler<HTMLInputElement>, 
    handleReset : MouseEventHandler<HTMLButtonElement>, 
    userHandle : string, 
    isValidated : boolean, 
    errorMessage : string, 
    successMessage : string 
}

function useUpdateUserHandle() : UseUpdateUserHandle {
    const appContext = useContext(AppContext)

    const [userHandle, setUserHandle] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')
    const [isValidated, setIsValidated] = useState<boolean>(true)
    const [all, setAll] = useState<string[]>([''])
    const regex = /^[a-zA-Z0-9._-]+$/


    function handleChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLInputElement) ) return
        setUserHandle(e.target.value)
    }


    useEffect( () => {
        ( function validate() {
            const isEmpty = userHandle.length === 0
            const isTooLong = userHandle.length > 15
            const hasForbiddenCharacters = !regex.test(userHandle)
            const isTaken = all.includes(userHandle) && userHandle !== appContext?.userHandle

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
            userId : appContext?.firebaseAuth?.uid as string,
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