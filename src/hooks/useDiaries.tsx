import { useState } from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios, { AxiosError } from "axios";
import type { DiaryInterface } from "@/models/interface";

export const useDiaries = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const [isLoading, setIsLoading] = useState(true);

    const getDiaries = async () => {
        if (!token) {
            throw new Error("token 이 존재하지 않아 투자 일지 조회에 실패했습니다.");
        }
        setIsLoading(true);

        try {
            const response = await axios.get<DiaryInterface[]>(
                "https://the-rich-coding-test1.herokuapp.com/diaries.json",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data;

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.message)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "투자 일지 조회에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };


    return { getDiaries, isLoading };
};