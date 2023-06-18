import { MouseEventHandler, useState, SyntheticEvent, useEffect, SetStateAction, Dispatch } from "react"
import { getAllUserHandles, updateUser } from "../../services/UserServices"
import Icon from "../Layout/Icon"
import ValidatedForm from "../ValidatedForm/components/ValidatedForm"
import { MAX_USER_HANDLE_LENGTH, MIN_USER_HANDLE_LENGTH } from "../../utils/appConfig"
import ValidatedField from "../ValidatedForm/components/ValidatedField"
import Button from "../Layout/Button"
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage"
import SubmitSuccessMessage from "../ValidatedForm/components/SubmitSuccessMessage"
import ValidatorRules from "../ValidatedForm/utils/ValidatorRules"
import useUser, { UseUser } from "../../hooks/useUser"
import { useDispatch } from "react-redux"
import { setUser } from "../../slices/userSlice"



export default function UpdateUserHandleForm() {

    const user = useUser()

    const [formUserHandle, setFormUserHandle] = useState<string>('')

    const { handleReset, handleFormSubmit, allUserHandles } = useUpdateUserHandle({formUserHandle, setFormUserHandle})
    

    return (
        <ValidatedForm 
            handleSubmit={handleFormSubmit} 
            rules={{auth : true}} 
            config={{successMessage: "User handle updated."}} 
        >

            <h2 className="flex justify-between my-2">
                Handle: {formUserHandle}
                <span className={`font-normal ${formUserHandle.length > MAX_USER_HANDLE_LENGTH || formUserHandle.length < MIN_USER_HANDLE_LENGTH ? 'text-red-400' : ''}`}>
                    {formUserHandle.length} / {MAX_USER_HANDLE_LENGTH}
                </span>
            </h2>

            <div className="grid grid-cols-[1ch_1fr] items-end gap-4">

                <label htmlFor="user-handle" className="text-xl font-bold -translate-y-2">@</label>

                <div>
                    <ValidatedField 
                        title={"User Handle"} 
                        value={formUserHandle} 
                        setValue={setFormUserHandle} 
                        type={"text"} 
                        id="user-handle"
                        rules={{
                            required : true,
                            minLength : MIN_USER_HANDLE_LENGTH,
                            maxLength : MAX_USER_HANDLE_LENGTH,
                            unique : {
                                current : user.handle,
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
    formUserHandle    : string,
    setFormUserHandle : Dispatch<SetStateAction<string>>,
}

interface UseUpdateUserHandle { 
    handleReset      : MouseEventHandler<HTMLButtonElement>, 
    handleFormSubmit : Function, 
    allUserHandles   : string[],
}

function useUpdateUserHandle({formUserHandle, setFormUserHandle} : UseUpdateUserHandleProps) : UseUpdateUserHandle {


    const user     = useUser()
    const dispatch = useDispatch()


    const [allUserHandles, setAllUserHandles] = useState<string[]>([''])


    useEffect( () => {

        ( async function loadAllUserHandles() {
            let handlesList = await getAllUserHandles()
            if( !Array.isArray(handlesList) ) return
            setAllUserHandles(handlesList)
        })();

    }, [user])


    useEffect( () => {
        
        ( function setDefaultFormUserHandle () {
            if(user.handle) setFormUserHandle(user.handle)
        })()

    }, [user])


    async function handleFormSubmit() {

        if( !(typeof user.id === 'string') ) return

        const update = await updateUser({
            userId   : user.id,
            newField : { handle : formUserHandle }
        })

        const updatedUser: UseUser = {
            id     : user.id,
            handle : formUserHandle
        }

        if( update.success ) {
            dispatch( setUser(updatedUser) )
        }
    }


    function handleReset(e: SyntheticEvent) {
        e.preventDefault()
        setFormUserHandle(user.handle)
    }


    return { handleReset, handleFormSubmit, allUserHandles }
}