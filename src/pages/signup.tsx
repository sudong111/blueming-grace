import { useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup";
import { AuthCard } from "@/components/authCard.tsx";

export const Signup = () => {
    const navigate = useNavigate();
    const { signupUser, isLoading } = useSignup();

    const handleSignup = async (email: string, password: string) => {
        try{
            await signupUser(email, password);

            alert(`회원가입에 성공했습니다.`);
            navigate("/");
        } catch (e) {
            const error = e as Error;
            alert(error.message);
        }
    }

    return (
        <div className="view justify-center">
            <AuthCard
                action={handleSignup} type="signup" isLoading={isLoading}
            />
        </div>
    )
}