import { useContext } from "react"
import { ValidatedFormContext } from "./ValidatedForm"
import ValidationIcon from "./ValidationIcon"



export default function SubmitSuccessMessage({...rest}) {


    const formContext = useContext(ValidatedFormContext)

    
    return (
        <div 
            className={` ${formContext?.formSubmitSuccessMessage ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-emerald-400 py-2`}
            {...rest}
        >
            <div className="overflow-hidden flex items-center gap-2">
                <ValidationIcon isValid={true} />
                {formContext?.formSubmitSuccessMessage}
            </div>
        </div>
    )
}
