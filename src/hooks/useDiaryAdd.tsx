import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios from "axios";
import type { DiaryAddInterface } from "@/models/interface";

export const useDiaryAdd = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const insertDiary = async (data : DiaryAddInterface) => {
        if(!token) {
            throw new Error("token 이 존재하지 않습니다.");
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
                throw new Error(`${result.message || "관리자에게 문의하세요."}`);
            }

            return result;

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
        }
    }
    return { insertDiary };
}