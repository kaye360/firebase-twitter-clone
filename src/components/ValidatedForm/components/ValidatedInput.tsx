import { Dispatch, InputHTMLAttributes } from "react"
import ValidationError from "./ValidationError"
import { Rules } from "../utils/ValidatorRules"
import useValidatedElement from "../hooks/useValidatedElement"



export interface ValidatedInputProps extends InputHTMLAttributes<HTMLElement> {
    title    : string,
    value    : string,
    setValue : Dispatch<React.SetStateAction<string>>,
    rules    : Rules,
}

export default function ValidatedInput({
    title, value, setValue, rules = {}, ...rest
} : ValidatedInputProps) {


    const { 
        hasUserTyped, 
        errorMessage, 
        handleOnChange 
    } = useValidatedElement({title, value, setValue, rules})


    return (
        <>
            <ValidationError message={hasUserTyped ? errorMessage : ''} />
            <input 
                value={value}
                onChange={ handleOnChange }
                {...rest} 
            />
        </>
    )
}
