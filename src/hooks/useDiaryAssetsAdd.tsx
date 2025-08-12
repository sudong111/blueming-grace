import axios, { AxiosError } from "axios";
import type { AssetAddInterface } from "@/models/interface.ts";

export const useDiaryAssetsAdd = () => {

    const insertDiaryAssets = async (diaryId: number, asset: AssetAddInterface, token: string | null) => {
        if(!token) {
            throw new Error("token 이 존재하지 않아 투자 종목 생성에 실패했습니다.");
        }

        try {
            const response = await axios.post(
                "https://the-rich-coding-test1.herokuapp.com/diary_assets.json",
                new URLSearchParams({
                    "diary_asset[diary_id]": diaryId.toString(),
                    "diary_asset[asset_id]": asset.id.toString(),
                    "diary_asset[amount]": asset.amount.toString(),
                    "diary_asset[buy_price]": asset.buy_price.toString()
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
                throw new Error(result.error);
            }

            return result;

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.error)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "투자 종목 생성에 실패했습니다.");
        }
    }
    return { insertDiaryAssets };
}