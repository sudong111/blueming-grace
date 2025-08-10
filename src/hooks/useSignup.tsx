import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useSignup() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

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
                console.log(result.message)
            }
            else {
                navigate("/");
            }
        } catch (e: any) {
            setError(e.message || "Unknown error");
        }
    }

    return { signupUser, error };
}