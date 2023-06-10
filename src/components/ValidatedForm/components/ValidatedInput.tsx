import { Dispatch, InputHTMLAttributes } from "react"



interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    state : string,
    setState : Dispatch<React.SetStateAction<string>>,
    rules : {

    }
}

export default function ValidatedInput({state, setState, rules, ...rest} : ValidatedInputProps) {
    return (
        <input 
            value={state}
            onChange={ e => setState(e.target.value) }
            className="p-4 rounded-lg border w-full h-36"
            {...rest} 
        />
    )
}
