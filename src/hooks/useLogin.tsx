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
                // 서버에서 message를 내려줬다면 사용, 없으면 기본 메시지
                message = e.response?.data?.message ?? message;
            } else if (e instanceof Error) {
                // 일반 Error 객체면 그 message 사용
                message = e.message || message;
            }

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return { loginUser, isLoading };
}