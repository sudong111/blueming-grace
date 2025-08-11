import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from "@/store";
import type { DiaryInterface } from "@/models/interface";

export const useInvestmentDiaries = () => {
    const token = useSelector((state: RootState) => state.login.token);
    const [diaries, setDiaries] = useState<DiaryInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        const getDiaries = async () => {
            try {
                const response = await fetch(
                    "https://the-rich-coding-test1.herokuapp.com/diaries.json",
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    alert(`투자 정보 조회에 실패했습니다. ${response.status}`);
                    return;
                }

                const result: DiaryInterface[] = await response.json();
                setDiaries(result);

            } catch (e) {
                const error = e as Error;
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        getDiaries();
    }, [token]);

    return { diaries, isLoading, error };
};