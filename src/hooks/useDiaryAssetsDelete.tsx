import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios from "axios";

export const useDiaryAssetsDelete = () => {
    const token = useSelector((state: RootState)=> state.login.token);

    const deleteDiaryAssets = async (diary_asset_id: number) => {
        if(!token) {
            throw new Error("token 이 존재하지 않습니다.");
        }

        try {
            const response = await axios.delete(
                `https://the-rich-coding-test1.herokuapp.com/diary_assets/${diary_asset_id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return await response.data;

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
    return { deleteDiaryAssets };
}