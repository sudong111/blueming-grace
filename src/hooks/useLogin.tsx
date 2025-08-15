import { useState } from "react";
import axios from 'axios';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loginUser = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://the-rich-coding-test1.herokuapp.com/users/login",
                new URLSearchParams({
                    email: email,
                    password: password,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                    }
                }
            );

            const result = await response.data;

            if(result.error) {
                throw new Error(`${result.message || "관리자에게 문의하세요."}`);
            }

            return { token: result.token, userId: result.user_id };

        } catch (e) {
            let message = "관리자에게 문의하세요.";

            if (axios.isAxiosError(e)) {
                message = e.response?.data?.message ?? message;
            } else if (e instanceof Error) {
                message = e.message || message;
            }

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return { loginUser, isLoading };
}