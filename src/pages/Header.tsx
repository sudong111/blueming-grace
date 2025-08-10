import {Button} from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { FaHome } from "react-icons/fa";

export default function Header() {
    const navigate = useNavigate()

    return (
        <div className="header">
            <div className="flex justify-between h-full mx-5 items-center">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                ><FaHome/></Button>
                <div className="flex gap-3">
                    <Button
                        variant="default"
                        onClick={() => navigate("/login")}
                    >
                        login
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/signup")}
                    >
                        sign-up
                    </Button>
                </div>
            </div>
        </div>
    )
}