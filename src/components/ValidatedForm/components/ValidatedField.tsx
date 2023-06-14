import { Dispatch, InputHTMLAttributes } from "react"
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


/**
 * @param title
 * (string) The name of the field as shown to the user
 * 
 * @param value
 * (string) Field value state
 * 
 * @param setValue
 * (setState function) Field value state setter
 * 
 * @param type
 * (string) Type of input. Ex: text, search, textarea etc.
 * 
 * @param showError
 * (boolean) Whether or not to show errors in realtime
 * 
 * @param rules
 * (interface Rule) Validation rules
 */
export default function ValidatedField({
    title, value, setValue, type, showError = true, rules = {}, ...rest
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
