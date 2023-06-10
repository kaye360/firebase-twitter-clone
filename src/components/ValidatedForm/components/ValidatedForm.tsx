import { SyntheticEvent, createContext, useContext } from "react";
import { UseValidatedFormContext } from "../hooks/useValidatedFormContext";
import ValidationError from "./ValidationError";




interface ValidatedFormProps {
    handleSubmit : Function,
    children : any,
}





export const ValidatedFormContext  = createContext<UseValidatedFormContext | null>(null)





export default function ValidatedForm({ handleSubmit, children } : ValidatedFormProps) {


    const validatedFormContext = useContext(ValidatedFormContext)


    return (
        <ValidatedFormContext.Provider value={validatedFormContext}>
            <ValidatedFormElement handleSubmit={handleSubmit}>
                {children}
            </ValidatedFormElement>
        </ValidatedFormContext.Provider>
    )
}





function ValidatedFormElement({ handleSubmit, children } : ValidatedFormProps) {

    const formContext = useContext(ValidatedFormContext)


    function handleFormSubmit(e: SyntheticEvent) {
        e.preventDefault()

        // onSubmit Validation

        if( typeof handleSubmit !== 'function' ) throw 'Missing handleSubmit function'
        handleSubmit()
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <ValidationError message={formContext?.errorMessage as string} />
            {children}
        </form>
    )  
}
