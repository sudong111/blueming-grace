import axios, { AxiosError } from "axios";
import type { DiaryAddInterface } from "@/models/interface";

export const useDiaryAdd = () => {

    const insertDiary = async (data : DiaryAddInterface, token: string | null) => {
        if(!token) {
            throw new Error("token 이 존재하지 않아 투자 일정 생성에 실패했습니다.");
        }

        try {
            const response = await axios.post(
                "https://the-rich-coding-test1.herokuapp.com/diaries.json",
                new URLSearchParams({
                    "diary[title]": data.title,
                    "diary[contents]": data.contents,
                    "diary[date]": data.date
                }),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                    }
                }
            );

            const result = await response.data;

            if(result.error) {
                throw new Error(`${result.message || "투자 일정 생성에 실패했습니다."}`);
            }

            return result;

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.error)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "투자 일정 생성에 실패했습니다.");
        }
    }
    return { insertDiary };
}