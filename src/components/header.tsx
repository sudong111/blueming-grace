import {Button} from '@/components/ui/button.tsx'
import { useNavigate } from 'react-router-dom'
import type {RootState} from "@/store";
import { logout } from "@/store/loginSlice";
import { FaHome } from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.login);

    return (
        <div className="header">
            <div className="flex justify-between h-full mx-5 py-3 items-center">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                >
                    <FaHome/>
                </Button>
                {!isLoggedIn ? (
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
                ) :
                    <div className="flex gap-3">
                        <Button
                            variant="default"
                        >
                            안녕하세요!
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => dispatch(logout())}
                        >
                            logout
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}