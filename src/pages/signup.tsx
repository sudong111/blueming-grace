import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSignup } from "@/hooks/useSignup";
import { AuthCard } from "@/components/authCard";

export const Signup = () => {
    const navigate = useNavigate();
    const { signupUser, isLoading } = useSignup();

    const handleSignup = async (email: string, password: string) => {
        try{
            await signupUser(email, password);

            toast.success("회원가입에 성공했습니다.");
            navigate("/");
        } catch (e) {
            const error = e as Error;
            toast.error(`회원가입 실패: ${error.message}`);
        }
    }

    return (
        <div className="view justify-center">
            <AuthCard
                action={handleSignup} isLoginType={false} isLoading={isLoading}
            />
        </div>
    )
}