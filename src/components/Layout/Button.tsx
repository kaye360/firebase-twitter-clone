import { ComponentPropsWithoutRef } from 'react'
import Icon from './Icon'


interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
	icon?      : string | null,
	children   : any,
	className? : string,
	disabled?  : boolean
}

export default function Button({ icon = null, className = '', disabled = false, children, ...rest }: ButtonProps) {
	return (
		<button
			disabled={disabled}
      		className={`
				flex items-center gap-2 px-4 py-3 font-bold rounded-lg transition-all duration-150 
				${className}
				${ disabled ? 'opacity-50 cursor-not-allowed' :  ''}
			`}
			{...rest}
		>
			{icon && <Icon icon={icon} />}
			{children}
		</button>
	)
}
