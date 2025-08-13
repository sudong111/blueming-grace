import type { DiaryAssetInterface, ComputedAssetInterface } from "@/models/interface.ts";

export const computeAssets = (
    diaryAssets: DiaryAssetInterface[],
    allAssets: { id: number; ticker: string; price: number }[]
): ComputedAssetInterface[] => {
    if (allAssets.length === 0 || diaryAssets.length === 0) return [];

    return diaryAssets.map(asset => {
        const target = allAssets.find(a => a.id === asset.asset_id);
        if (!target) {
            return {
                id: 0,
                ticker: '',
                amount: 0,
                buy_price: asset.buy_price,
                present_price: 0,
                rate: 0,
            };
        }

        const buyPrice = asset.buy_price;
        const presentPrice = Number(target.price);
        const rate = ((presentPrice - buyPrice) / buyPrice) * 100;

        return {
            id: asset.id,
            ticker: target.ticker,
            amount: asset.amount,
            buy_price: buyPrice,
            present_price: presentPrice,
            rate: Math.round(rate * 100) / 100,
        };
    });
};