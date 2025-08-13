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
                // 서버에서 message를 내려줬다면 사용, 없으면 기본 메시지
                // 회원가입은 email 로 error message 전송
                message = e.response?.data?.email ?? message;
            } else if (e instanceof Error) {
                // 일반 Error 객체면 그 message 사용
                message = e.message || message;
            }

            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    }

    return { signupUser, isLoading };
}