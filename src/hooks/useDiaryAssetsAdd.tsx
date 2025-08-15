import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import axios from "axios";
import type { AssetAddInterface } from "@/models/interface.ts";

export const useDiaryAssetsAdd = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const insertDiaryAssets = async (diaryId: number, asset: AssetAddInterface) => {
        if(!token) {
            throw new Error("token 이 존재하지 않습니다.");
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
            let message = "관리자에게 문의하세요.";

            if (axios.isAxiosError(e)) {
                if(e.response?.data.asset[0] === 'must exist') {
                    message = "선택 되지 않은 종목이 있습니다."
                }
                else {
                    message = e.response?.data?.message ?? message;
                }
            } else if (e instanceof Error) {
                message = e.message || message;
            }

            throw new Error(message);
        }
    }
    return { insertDiaryAssets };
}