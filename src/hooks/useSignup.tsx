import { useState } from "react";
import axios from 'axios';

export const useSignup = () => {
    const [isLoading, setIsLoading] = useState(false);

    const signupUser = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://the-rich-coding-test1.herokuapp.com/users.json",
                new URLSearchParams({
                    "user[email]": email,
                    "user[password]": password,
                }),
                {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            const result = await response.data;

            if(result.error) {
                throw new Error(`${result.message || "관리자에게 문의하세요."}`);
            }

            return;

        } catch (e) {
            let message = "관리자에게 문의하세요.";

            if (axios.isAxiosError(e)) {
                message = e.response?.data?.email ?? message;
            } else if (e instanceof Error) {
                message = e.message || message;
            }

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return { signupUser, isLoading };
}