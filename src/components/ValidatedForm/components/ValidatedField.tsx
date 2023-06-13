import { Dispatch, InputHTMLAttributes, MutableRefObject } from "react"
import ValidationError from "./ValidationError"
import { Rules } from "../utils/ValidatorRules"
import useValidatedField from "../hooks/useValidatedField"



export interface ValidatedFieldProps extends InputHTMLAttributes<HTMLElement> {
    title      : string,
    value      : string,
    setValue   : Dispatch<React.SetStateAction<string>>,
    type       : 'text' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'textarea',
    showError? : boolean,
    rules      : Rules,
}


export default function ValidatedField({
    title, value, setValue, type, showError, rules = {}, ...rest
} : ValidatedFieldProps) {


    const { 
        hasUserTyped, 
        errorMessage, 
        handleOnChange 
    } = useValidatedField({title, value, setValue, rules})


    return (
        <>
            { showError &&
                <ValidationError message={hasUserTyped ? errorMessage : ''} />
            }

            { type === 'textarea' ? (

                <textarea
                    value={value}
                    onChange={handleOnChange}
                    {...rest}
                ></textarea>

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
