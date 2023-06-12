import { FormHTMLAttributes, SyntheticEvent, createContext, useContext } from "react";
import useValidatedFormContext, { UseValidatedFormContext } from "../hooks/useValidatedFormContext";
import ValidatorRules, { Rules } from "../utils/ValidatorRules";




interface ValidatedFormProps extends FormHTMLAttributes<HTMLFormElement> {
    handleSubmit : Function,
    rules        : Rules,
    config       : {
        successMessage : string
    }
    children     : any,
}





export const ValidatedFormContext  = createContext<UseValidatedFormContext | null>(null)




/**
 * @description
 * Form component with automatic validation.
 * Create a state for each field and pass into each <ValidatedField />
 * Set the title to the name that appears in the error message.
 * 
 * @param handleSubmit (function) Form onSubmit handler. This is the action to be taken on 
 * form submit after successful validation. No need for e.preventDefault().
 * 
 * @param config (object) 
 * 
 * @property successMessage 
 * Message shown on successfull form submit
 * 
 * @param rules (object Rules) Rules object to be checked on form submission. Other form elements
 * will also automatically be checke first.
 * 
 * @example
 * 
 * const [field1, setField1] = useState<string>('')
 * 
 * <ValidatedForm handleSubmit={ yourHandleSubmitFunction }>
 * 
 * <label>
 *   Field One Name
 *   <ValidatedField 
 *     type="text | textarea | ..." 
 *     title="Field One Name" 
 *     value={field1} 
 *     setValue={setField1}
 *     rules={{minLength : 5, maxLength : 10}}
 *   />
 * </label>
 * 
 * <SubmitErrorMessage />
 * <SubmitSuccessMessage />
 * 
 * <button type="submit">Submit</button>
 * 
 */
export default function ValidatedForm({ handleSubmit, rules = {}, config, children, ...rest } : ValidatedFormProps) {


    const validatedFormContext = useValidatedFormContext()


    return (
        <ValidatedFormContext.Provider value={validatedFormContext}>
            <ValidatedFormElement handleSubmit={handleSubmit} rules={rules} config={config} {...rest}>
                {children}
            </ValidatedFormElement>
        </ValidatedFormContext.Provider>
    )
}





function ValidatedFormElement({ handleSubmit, rules, config, children, ...rest } : ValidatedFormProps) {

    const formContext = useContext(ValidatedFormContext)

    async function handleFormSubmit(e: SyntheticEvent) {
        e.preventDefault()

        try {
            if( typeof handleSubmit !== 'function' ) throw 'handleSubmit must be a function.'
            if( typeof config !== 'object') throw 'Config object not set.'
            if( typeof config.successMessage !== 'string') throw 'onSubmit success message not set in config object.'
            validateOnSubmit()
            await handleSubmit()
            formContext?.setFormSubmitSuccessMessage(config.successMessage)
            
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
        <form 
            onSubmit={handleFormSubmit} 
            onChange={() => formContext?.setFormSubmitErrorMessage('')}
            {...rest}
        >
            {children}
        </form>
    )  
}
