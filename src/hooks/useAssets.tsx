import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios from "axios";
import type { AssetInterface } from "@/models/interface";

export const useAssets = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const getAssets = async () => {
        if (!token) {
            throw new Error("token 이 존재하지 않습니다.");
        }

        try {
            const response = await axios.get<AssetInterface[]>(
                "https://the-rich-coding-test1.herokuapp.com/assets.json",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data;

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

    return { getAssets };
};