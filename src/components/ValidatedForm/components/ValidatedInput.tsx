import { Dispatch, InputHTMLAttributes, SyntheticEvent, useContext, useEffect, useState } from "react"
import ValidationError from "./ValidationError"
import { ValidatedFormContext } from "./ValidatedForm"
import { FormState } from "../hooks/useValidatedFormContext"
import ValidatorRules, { Rules } from "../utils/ValidatorRules"



interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    title : string,
    state : string,
    setState : Dispatch<React.SetStateAction<string>>,
    rules : Rules,
}

export default function ValidatedInput({title, state, setState, rules = {}, ...rest} : ValidatedInputProps) {


    const validatedFormContext = useContext(ValidatedFormContext)

    
    /**
     * If rules.required or rules.minLength, set the Formstate to error by default.  
     */
    let defaultFormStateErrorMessage: string | null
    
    if( rules.required ) {
        defaultFormStateErrorMessage = `${title} is required.`

    } else if( rules.minLength && state.length < rules.minLength ) {
        defaultFormStateErrorMessage = `${title} must have a minimum of ${rules.minLength} characters.`
        
    } else {
        defaultFormStateErrorMessage = null
    }


    const [errorMessage, setErrorMessage] = useState<string>('')
    const [hasUserTyped, setHasUserTyped] = useState<boolean>(false)


    function handleOnChange(e: SyntheticEvent) {
        if( !(e.target instanceof HTMLInputElement) ) return
        setState(e.target.value)
        setHasUserTyped(true)
    }


    useEffect( () => {
        // Initialize Error Property for this Input on initial render
        const formState = {...validatedFormContext?.formState } as FormState
        formState.errors[title] = defaultFormStateErrorMessage
        validatedFormContext?.setFormState(formState)
    }, [])


    useEffect( () => {
        // Validation as user types

        if( !hasUserTyped ) return
        const prev = {...validatedFormContext?.formState} as FormState

        try {
            ValidatorRules.validate({title, string : state, rules})
            setErrorMessage('')
            prev.errors[title] = null
            validatedFormContext?.setFormState(prev)

        } catch (error) {
            if( typeof error !== 'string') return

            setErrorMessage(error)
            prev.errors[title] = error
            validatedFormContext?.setFormState(prev)
        }

    }, [state])


    return (
        <>
            <ValidationError message={hasUserTyped ? errorMessage : ''} />
            <input 
                value={state}
                onChange={ handleOnChange }
                className="p-4 rounded-lg border w-full"
                // required={ rules.required }
                {...rest} 
            />
        </>
    )
}
