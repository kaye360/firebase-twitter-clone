import { MouseEventHandler, useContext, useState, SyntheticEvent, useEffect, SetStateAction, Dispatch } from "react"
import { AppContext } from "../../App"
import { getAllUserHandles, updateUser } from "../../services/UserServices"
import Icon from "../Layout/Icon"
import ValidatedForm from "../ValidatedForm/components/ValidatedForm"
import { MAX_USER_HANDLE_LENGTH, MIN_USER_HANDLE_LENGTH } from "../../utils/appConfig"
import ValidatedField from "../ValidatedForm/components/ValidatedField"
import Button from "../Layout/Button"
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../ValidatedForm/components/SubmitSuccessMessage"
import ValidatorRules from "../ValidatedForm/utils/ValidatorRules"
import { UseAppContext } from "../../hooks/useAppContext"



export default function UpdateUserHandleForm() {


    const [userHandle, setUserHandle] = useState<string>('')
    const { handleReset, handleFormSubmit, allUserHandles, appContext } = useUpdateUserHandle({userHandle, setUserHandle})
    

    return (
        <ValidatedForm 
            handleSubmit={handleFormSubmit} 
            rules={{auth : true}} 
            config={{successMessage: "User handle updated."}} 
        >

            <h2 className="flex justify-between my-2">
                Handle:
                <span className={`font-normal ${userHandle.length > MAX_USER_HANDLE_LENGTH || userHandle.length < MIN_USER_HANDLE_LENGTH ? 'text-red-400' : ''}`}>
                    {userHandle.length} / {MAX_USER_HANDLE_LENGTH}
                </span>
            </h2>

            <div className="grid grid-cols-[1ch_1fr] items-end gap-4">

                <label htmlFor="user-handle" className="text-xl font-bold -translate-y-2">@</label>

                <div>
                    <ValidatedField 
                        title={"User Handle"} 
                        value={userHandle} 
                        setValue={setUserHandle} 
                        type={"text"} 
                        id="user-handle"
                        rules={{
                            required : true,
                            minLength : MIN_USER_HANDLE_LENGTH,
                            maxLength : MAX_USER_HANDLE_LENGTH,
                            unique : {
                                current : appContext?.userHandle as string,
                                all     : allUserHandles
                            },
                            allowableChars : {
                                regex : ValidatorRules.regexUserHandle,
                                chars : 'letters, numbers, periods, underscores, and hyphens'
                            }
                        }}
                    />
                </div>

            </div>

            <SubmitErrorMessage />
            <SubmitSuccessMessage />

            <div className="flex items-center gap-4 mt-2">
                <Button type="submit" className="bg-blue-100 hover:bg-fuchsia-50">
                    <Icon icon="save" /> Save
                </Button>

                <Button type="reset" onClick={ handleReset } className="border border-blue-300 hover:border-fuchsia-300">
                    Reset
                </Button>
            </div>


        </ValidatedForm>
    )
}





interface UseUpdateUserHandleProps {
    userHandle    : string,
    setUserHandle : Dispatch<SetStateAction<string>>,
}

interface UseUpdateUserHandle { 
    handleReset      : MouseEventHandler<HTMLButtonElement>, 
    handleFormSubmit : Function, 
    allUserHandles   : string[],
    appContext       : UseAppContext | null,
}

function useUpdateUserHandle({userHandle, setUserHandle} : UseUpdateUserHandleProps) : UseUpdateUserHandle {


    const appContext                          = useContext(AppContext)
    const [allUserHandles, setAllUserHandles] = useState<string[]>([''])


    useEffect( () => {
        ( async function loadAllUserHandles() {

            let handlesList = await getAllUserHandles()
            if( !Array.isArray(handlesList) ) return

            // handlesList = handlesList?.filter( handle => handle !== appContext?.userHandle)
            setAllUserHandles(handlesList)
        })();
    }, [appContext?.userHandle])


    useEffect( () => {
        ( function setInputToCurrentUserHandle () {
            if(appContext?.userHandle) setUserHandle(appContext?.userHandle)
        })()
    }, [appContext?.userHandle])


    async function handleFormSubmit() {

        const update = await updateUser({
            userId   : appContext?.firebaseAuth?.uid as string,
            newField : { handle : userHandle }
        })

        if( update.success ) {
            appContext?.setUserHandle(userHandle)
        }
    }


    function handleReset(e: SyntheticEvent) {
        e.preventDefault()
        setUserHandle(appContext?.userHandle as string)
    }


    return { handleReset, handleFormSubmit, allUserHandles, appContext }
}