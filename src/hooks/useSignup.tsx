import { useNavigate } from "react-router-dom";

export const useSignup = () => {
    const navigate = useNavigate();

    const signupUser = async (email: string, password: string) => {

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

            if(!response.ok) {
                alert(result.email);
                return;
            }
            else {
                alert(`회원가입에 성공했습니다.`);
                navigate("/");
            }
        } catch (e) {
            const error = e as Error;
            alert(`회원가입에 실패했습니다.\n${error.message || "Unknown error"}`);
        }
    }

    return { signupUser };
}