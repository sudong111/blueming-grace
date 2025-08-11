import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from "@/store";
import type { DiaryInterface } from "@/models/interface";
import axios, {AxiosError} from "axios";

export const useInvestmentDiaryDetail = () => {
    const token = useSelector((state: RootState) => state.login.token);
    const [diary, setDiary] = useState<DiaryInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        const getDiaries = async () => {
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

                setDiary(response.data);

            } catch (e) {
                const message = (e instanceof AxiosError && e.response?.data?.message)
                    ? e.response.data.message
                    : (e as Error).message;
                throw new Error(message || "투자 일지 조회에 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        getDiaries();
    }, [token]);

    return { diary, isLoading };
};