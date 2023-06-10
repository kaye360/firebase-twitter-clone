import { Dispatch, useState } from "react";



export interface UseValidatedFormContext {
    errorMessage : string,
    setErrorMessage : Dispatch<React.SetStateAction<string>>,
}


export default function useValidatedFormContext() : UseValidatedFormContext {

    const [errorMessage, setErrorMessage] = useState<string>('')

    return { errorMessage, setErrorMessage }
}
