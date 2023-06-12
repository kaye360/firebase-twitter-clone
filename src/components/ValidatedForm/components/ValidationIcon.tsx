import Icon, { IconProps } from "../../Icon";

interface ValidationIconProps extends IconProps {
    isValid : boolean,
    className? : string
}

export default function ValidationIcon({ isValid, className = '' } : ValidationIconProps) {
    return (
        <div>
            { isValid ? (
                <Icon icon="check_circle" className={`text-emerald-400 ${className}`} />
            ) : (
                <Icon icon="error_outline" className={`text-rose-400 ${className}`} />
            )}
        </div>
    )
}
