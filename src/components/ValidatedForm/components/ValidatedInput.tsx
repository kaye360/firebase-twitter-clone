import { Dispatch, InputHTMLAttributes } from "react"
import ValidationError from "./ValidationError"
import { Rules } from "../utils/ValidatorRules"
import useValidateElement from "../hooks/useValidateElement"



export interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
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
    } = useValidateElement({title, value, setValue, rules})


    return (
        <>
            <ValidationError message={hasUserTyped ? errorMessage : ''} />
            <input 
                value={value}
                onChange={ handleOnChange }
                className=""
                {...rest} 
            />
        </>
    )
}
