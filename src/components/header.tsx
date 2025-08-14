import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/loginSlice";
import { clearDiaries } from "@/store/diariesSlice";
import { clearAssets } from "@/store/assetsSlice";
import { Button } from '@/components/ui/button'
import { FaHome } from "react-icons/fa";

export const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.login);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearDiaries());
        dispatch(clearAssets());
        navigate("/");
    }

    return (
        <div className="header">
            <div className={`flex h-full mx-5 py-3 items-center ${!isLoggedIn ? 'justify-end' : 'justify-between'}`}>
                <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className={`blue-button ${!isLoggedIn ? 'hidden' : ''}`}
                >
                    <FaHome/>
                </Button>
                {!isLoggedIn ? (
                    <div className="flex gap-3">
                        <Button
                            variant="default"
                            onClick={() => navigate("/login")}
                            className="login-button"
                        >
                            login
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/signup")}
                            className="blue-button"
                        >
                            sign-up
                        </Button>
                    </div>
                ) :
                    <Button
                        variant="outline"
                        onClick={() => handleLogout() }
                        className="blue-button"
                    >
                        logout
                    </Button>
                }
            </div>
        </div>
    )
}