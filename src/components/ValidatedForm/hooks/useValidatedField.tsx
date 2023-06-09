import { useContext, useState, SyntheticEvent, useEffect, ChangeEventHandler, Dispatch, InputHTMLAttributes } from "react"
import { ValidatedFormContext } from "../components/ValidatedForm"
import ValidatorRules, { Rules } from "../utils/ValidatorRules"
import { FormState } from "./useValidatedFormContext"



interface UseValidatedFieldProps extends InputHTMLAttributes<HTMLElement> {
    title    : string,
    value    : string,
    setValue : Dispatch<React.SetStateAction<string>>,
    rules    : Rules,
}

interface UseValidatedField { 
    hasUserTyped   : boolean, 
    errorMessage   : string, 
    handleOnChange : ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function useValidatedField({
    title, 
    value, 
    setValue, 
    rules
} : UseValidatedFieldProps) : UseValidatedField {
    

    const validatedFormContext = useContext(ValidatedFormContext)

    
    /**
     * If rules.required or rules.minLength, set the Formstate to error by default.  
     */
    let defaultFormStateErrorMessage: string | null
    
    if( rules.required && !value ) {
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
        validatedFormContext?.setFormSubmitErrorMessage('')
        validatedFormContext?.setFormSubmitSuccessMessage('')
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
        if( !hasUserTyped ) {
            setHasUserTyped(true)
            return
        }
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

