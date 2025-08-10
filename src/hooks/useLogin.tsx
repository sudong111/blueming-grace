import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/store/loginSlice";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    async function loginUser(email: string, password: string) {
        setError(null);

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
                console.log(result.message)
            }
            else {
                dispatch(login(result.token));
                localStorage.setItem("token", result.token);
                navigate("/");
            }
        } catch (e: any) {
            setError(e.message || "Unknown error");
        }
    }

    return { loginUser, error };
}