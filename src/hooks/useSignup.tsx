import { useState } from "react";
import axios, { AxiosError } from 'axios';

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
                throw new Error(`${result.message || "회원가입에 실패했습니다."}`);
            }

            return;

        } catch (e) {
            // return 값이 message 가 아니고 email 로 옴
            const message = (e instanceof AxiosError && e.response?.data?.email)
                ? e.response.data.email
                : (e as Error).message;
            throw new Error(message || "회원가입에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    return { signupUser, isLoading };
}