import { useContext, useState, SyntheticEvent, useEffect, ChangeEventHandler } from "react"
import { ValidatedFormContext } from "../components/ValidatedForm"
import ValidatorRules from "../utils/ValidatorRules"
import { FormState } from "./useValidatedFormContext"
import { ValidatedInputProps } from "../components/ValidatedInput"



interface UseValidatedElement { 
    hasUserTyped   : boolean, 
    errorMessage   : string, 
    handleOnChange : ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function useValidatedElement({title, value, setValue, rules} : ValidatedInputProps) : UseValidatedElement {
    

    const validatedFormContext = useContext(ValidatedFormContext)

    
    /**
     * If rules.required or rules.minLength, set the Formstate to error by default.  
     */
    let defaultFormStateErrorMessage: string | null
    
    if( rules.required ) {
        defaultFormStateErrorMessage = `${title} is required.`

    } else if( rules.minLength && value.length < rules.minLength ) {
        defaultFormStateErrorMessage = `${title} must have a minimum of ${rules.minLength} characters.`
        
    } else {
        defaultFormStateErrorMessage = null
    }


    const [errorMessage, setErrorMessage] = useState<string>('')
    const [hasUserTyped, setHasUserTyped] = useState<boolean>(false)


    function handleOnChange(e: SyntheticEvent) {
        if( !(
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
        ) ) return
        setValue(e.target.value)
        setHasUserTyped(true)
    }


    /**
     * On intial render:
     * Initialize Error Property for this Input on formContext
     */
    useEffect( () => {
        const formState = {...validatedFormContext?.formState } as FormState
        formState.errors[title] = defaultFormStateErrorMessage
        validatedFormContext?.setFormState(formState)
    }, [])


    /**
     * Validation as user types
     */
    useEffect( () => {

        if( !hasUserTyped ) return
        const prev = {...validatedFormContext?.formState} as FormState

        try {
            ValidatorRules.validate({title, string : value, rules})
            setErrorMessage('')
            prev.errors[title] = null
            validatedFormContext?.setFormState(prev)

        } catch (error) {
            if( typeof error !== 'string') return

            setErrorMessage(error)
            prev.errors[title] = error
            validatedFormContext?.setFormState(prev)
        }

    }, [value])


    return { hasUserTyped, errorMessage, handleOnChange }
}

