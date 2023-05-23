

interface IconProps {
    className? : string,
    icon : string
}

export default function Icon({ className = '', icon } : IconProps) {
    return (
        <span className={`material-icons-outlined ${className}`}>
            {icon}
        </span>
    )
}
