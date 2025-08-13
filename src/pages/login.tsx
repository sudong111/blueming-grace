import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "@/store/loginSlice";
import { useLogin } from "@/hooks/useLogin";
import { AuthCard } from "@/components/authCard";

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loginUser, isLoading } = useLogin();

    const handleLogin = async (email: string, password: string) => {
        try {
            const result = await loginUser(email, password);

            dispatch(login({ token: result.token, user_id: result.userId }));
            toast.success('로그인에 성공했습니다.');
            navigate("/");

        } catch (e) {
            const error = e as Error;
            toast.error(`로그인 실패: ${error.message}`);
        }
    }

    return (
        <div className="view justify-center">
            <AuthCard
                action={handleLogin} type= "login" isLoading={isLoading}
            />
        </div>
    )
}