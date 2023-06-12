import { useContext } from "react"
import { ValidatedFormContext } from "./ValidatedForm"



export default function SubmitErrorMessage({...rest}) {

    const formContext = useContext(ValidatedFormContext)

    return (
        <div 
            className={` ${formContext?.formSubmitErrorMessage ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-rose-500 py-2`}
            {...rest}
        >
            <div className="overflow-hidden">
                {formContext?.formSubmitErrorMessage}
            </div>
        </div>
    )
}
