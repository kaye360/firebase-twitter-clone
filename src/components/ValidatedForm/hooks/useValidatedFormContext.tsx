import { Dispatch, useState } from "react";



export interface FormState {
    errors : { [key: string] : string | null },
}

export interface UseValidatedFormContext {
    formState                 : FormState,
    setFormState              : Dispatch<React.SetStateAction<FormState>>,
    formSubmitErrorMessage    : string,
    setFormSubmitErrorMessage : Dispatch<React.SetStateAction<string>>
}


export default function useValidatedFormContext() : UseValidatedFormContext {

    const defaultState : FormState = {
        errors : {},
    }

    const [formState, setFormState] = useState<FormState>(defaultState)

    const [formSubmitErrorMessage, setFormSubmitErrorMessage] = useState<string>('')

    return { formState, setFormState, formSubmitErrorMessage, setFormSubmitErrorMessage }
}
