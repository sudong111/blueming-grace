import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useSignup() {
    const navigate = useNavigate();

    async function signupUser(email: string, password: string) {

        try {
            const response = await fetch("https://the-rich-coding-test1.herokuapp.com/users.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    "user[email]": email,
                    "user[password]": password,
                }),
            });

            const result = await response.json();

            if(result.error) {
                toast.error(`회원가입에 실패했습니다.\n${result.message || "Unknown error"}`);
            }
            else {
                toast.success(`회원가입에 성공했습니다.`);
                navigate("/");
            }
        } catch (e) {
            const error = e as Error;
            toast.error(`회원가입에 실패했습니다.\n${error.message || "Unknown error"}`);
        }
    }

    return { signupUser };
}