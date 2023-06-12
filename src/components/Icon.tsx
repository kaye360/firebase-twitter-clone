

export interface IconProps {
    className? : string,
    icon?      : string
}

export default function Icon({ className = '', icon } : IconProps) {
    return (
        <span className={`material-icons-outlined transition-all duration-150 ${className}`}>
            {icon}
        </span>
    )
}
