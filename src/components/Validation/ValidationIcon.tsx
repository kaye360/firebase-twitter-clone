import Icon from "../Icon";

interface ValidationIconProps {
    isValid : boolean
}

export default function ValidationIcon({isValid} : ValidationIconProps) {
    return (
        <div>
            {isValid ? (
                <Icon icon="check_circle" className="text-emerald-400" />
            ) : (
                <Icon icon="error_outline" className="text-rose-400" />
            )}
        </div>
    )
}
