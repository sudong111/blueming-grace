import axios, {AxiosError} from "axios";
import type {DiaryAssetInterface} from "@/models/interface";

export const useDiaryAssets = (diaryId: number) => {

    const getDiaryAssets = async (token: string | null) => {
        if(!token) {
            throw new Error("token 이 존재하지 않아 투자 종목 조회에 실패했습니다.");
        }
        if (diaryId === -1) {
            throw new Error("투자 일정이 존재하지 않아 투자 종목 조회에 실패했습니다.");
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
            throw new Error(message || "투자 종목 조회에 실패했습니다.");
        }
    }

    return { getDiaryAssets };
};