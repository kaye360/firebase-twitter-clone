import ValidationError from "./ValidationError"
import useValidatedElement from "../hooks/useValidatedElement"
import { ValidatedInputProps } from "./ValidatedInput"



interface ValidatedTextareaProps extends ValidatedInputProps {}

export default function ValidatedTextarea({
	title, value, setValue, rules = {}, ...rest
} : ValidatedTextareaProps) {


	const {
		hasUserTyped,
		errorMessage,
		handleOnChange
	} = useValidatedElement({ title, value, setValue, rules })


	return (
		<>
			<ValidationError message={hasUserTyped ? errorMessage : ''} />
			<textarea
				value={value}
				onChange={handleOnChange}
				{...rest}
			/>
		</>
	)
}
