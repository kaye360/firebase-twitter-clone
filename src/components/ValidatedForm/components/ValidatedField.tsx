import { Dispatch, InputHTMLAttributes, MutableRefObject } from "react"
import ValidationError from "./ValidationError"
import { Rules } from "../utils/ValidatorRules"
import useValidatedField from "../hooks/useValidatedField"



export interface ValidatedFieldProps extends InputHTMLAttributes<HTMLElement> {
    title    : string,
    value    : string,
    setValue : Dispatch<React.SetStateAction<string>>,
    rules    : Rules,
    type     : 'text' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'textarea',
    ref?     : MutableRefObject<any>
}


export default function ValidatedField({
    title, value, setValue, type, rules = {}, ...rest
} : ValidatedFieldProps) {


    const { 
        hasUserTyped, 
        errorMessage, 
        handleOnChange 
    } = useValidatedField({title, value, setValue, rules})


    return (
        <>
            <ValidationError message={hasUserTyped ? errorMessage : ''} />

            { type === 'textarea' ? (

                <textarea
                    value={value}
                    onChange={handleOnChange}
                    {...rest}
                />

            ) : (

                <input 
                    value={value}
                    onChange={ handleOnChange }
                    type={type}
                    {...rest} 
                />

            )}
        </>
    )
}
