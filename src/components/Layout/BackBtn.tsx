import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Button from "./Button";



interface BackBtnProps {
    title: string,
}

export default function BackBtn({ title }: BackBtnProps) {

    const navigate = useNavigate()

    return (
        <Button 
            onClick={() => navigate(-1)}
            className="hover:text-blue-400 pl-0"
        >

            <Icon icon="arrow_back" />

            {title}

        </Button>
    )
}
