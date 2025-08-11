import { useSelector } from 'react-redux';
import type { RootState } from "@/store";
import axios, { AxiosError } from "axios";
import type { DiaryAssetInterface } from "@/models/interface";

export const useDiaryAssets = (diaryId: number) => {
    const token = useSelector((state: RootState) => state.login.token);

    const getDiaryAssets = async () => {
        if (!token) {
            return [];
        }

        try {
            const response = await axios.get<DiaryAssetInterface[]>(
                `https://the-rich-coding-test1.herokuapp.com/diaries/${diaryId}/assets.json`,
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
            throw new Error(message || "투자일지 속 자산 정보 조회에 실패했습니다.");
        }
    }

    return { getDiaryAssets };
};