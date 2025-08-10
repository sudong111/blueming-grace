import { useDispatch } from "react-redux";
import { login } from "@/store/loginSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function loginUser(email: string, password: string) {

        try {
            const response = await fetch(
                "https://the-rich-coding-test1.herokuapp.com/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({ email, password }),
                }
            );

            const result = await response.json();

            if(result.error) {
                toast.error(`로그인에 실패했습니다.\n${result.message || "Unknown error"}`);
            }
            else {
                dispatch(login({ token: result.token, user_id: result.user_id }));
                toast.success(`로그인에 성공했습니다.`);
                navigate("/");
            }
        } catch (e) {
            const error = e as Error;
            toast.error(`로그인에 실패했습니다.\n${error.message || "Unknown error"}`);
        }
    }

    return { loginUser };
}