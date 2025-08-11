import { useState } from "react";
import axios, {AxiosError} from 'axios';

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
                throw new Error(`${result.message || "로그인에 실패했습니다."}`);
            }

            return { token: result.token, userId: result.user_id };

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.message)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "로그인에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    return { loginUser, isLoading };
}