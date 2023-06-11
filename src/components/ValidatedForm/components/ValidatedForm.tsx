import { SyntheticEvent, createContext, useContext } from "react";
import useValidatedFormContext, { UseValidatedFormContext } from "../hooks/useValidatedFormContext";
import ValidatorRules, { Rules } from "../utils/ValidatorRules";




interface ValidatedFormProps {
    handleSubmit : Function,
    rules        : Rules,
    children     : any,
}





export const ValidatedFormContext  = createContext<UseValidatedFormContext | null>(null)




/**
 * 
 * @param handleSubmit (function) Form onSubmit handler. This is the action to be taken on 
 * form submit after successful validation. No need for e.preventDefault().
 * 
 * @param rules (object Rules) Rules object to be checked on form submission. Other form elements
 * will also automatically be checke first.
 * 
 */
export default function ValidatedForm({ handleSubmit, rules = {}, children } : ValidatedFormProps) {


    const validatedFormContext = useValidatedFormContext()


    return (
        <ValidatedFormContext.Provider value={validatedFormContext}>
            <ValidatedFormElement handleSubmit={handleSubmit} rules={rules}>
                {children}
            </ValidatedFormElement>
        </ValidatedFormContext.Provider>
    )
}





function ValidatedFormElement({ handleSubmit, rules, children } : ValidatedFormProps) {

    const formContext = useContext(ValidatedFormContext)

    function handleFormSubmit(e: SyntheticEvent) {
        e.preventDefault()

        console.log(formContext?.formState)

        try {
            if( typeof handleSubmit !== 'function' ) throw 'handleSubmit must be a function'
            validateOnSubmit()
            handleSubmit()
            
        } catch (error) {
            if( (typeof error !== 'string' ) ) return
            formContext?.setFormSubmitErrorMessage(error)   
        }

    }

    
    /**
     * @function  validateOnSubmit()
     * 
     * Checks if there are any remaining input validation errors. 
     * If ok, runs form submit validation rules.
     */
    function validateOnSubmit() {

        // Check for individual input errors before checking form onSubmit rules
        for (const error in formContext?.formState.errors ) {

            if( typeof formContext.formState.errors[error] === 'string' ) {
                throw formContext.formState.errors[error]
            }
        }
        
        ValidatorRules.validate({title : 'FormSubmit', string : '', rules})
    }


    return (
        <form onSubmit={handleFormSubmit}>
            {children}
        </form>
    )  
}
