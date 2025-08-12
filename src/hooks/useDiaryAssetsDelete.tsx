import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios, { AxiosError } from "axios";

export const useDiaryAssetsDelete = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const deleteDairyAssets = async (diary_asset_id: number) => {
        if(!token) {
            throw new Error("token 이 유효하지 않습니다.");
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
            const message = (e instanceof AxiosError && e.response?.data?.error)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "투자 자산 삭제에 실패했습니다.");
        }
    }
    return { deleteDairyAssets };
}