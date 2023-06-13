import { useContext } from "react"
import { ValidatedFormContext } from "./ValidatedForm"
import ValidationIcon from "./ValidationIcon"



export default function SubmitSuccessMessage({...rest}) {


    const formContext = useContext(ValidatedFormContext)

    
    return (
        <div 
            className={` ${formContext?.formSubmitSuccessMessage ? 'grid grid-rows-[1fr] py-2' : 'grid grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-emerald-400`}
            {...rest}
        >
            <div className="overflow-hidden flex items-center gap-2">
                <ValidationIcon isValid={true} className="translate-y-[2px]" />
                {formContext?.formSubmitSuccessMessage}
            </div>
        </div>
    )
}
