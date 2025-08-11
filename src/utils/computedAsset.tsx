import type { diaryAssetInterface, computedAssetInterface } from "@/models/interface.ts";

export const computeAssets = (
    diaryAssets: diaryAssetInterface[],
    allAssets: { id: number; ticker: string; price: number }[]
): computedAssetInterface[] => {
    if (allAssets.length === 0 || diaryAssets.length === 0) return [];

    return diaryAssets.map(asset => {
        const target = allAssets.find(a => a.id === asset.asset_id);
        if (!target) {
            return {
                id: 0,
                ticker: '',
                buy_price: asset.buy_price,
                present_price: 0,
                rate: 0,
            };
        }

        const buyPrice = asset.buy_price;
        const presentPrice = Number(target.price);
        const rate = ((presentPrice - buyPrice) / buyPrice) * 100;

        return {
            id: target.id,
            ticker: target.ticker,
            buy_price: buyPrice,
            present_price: presentPrice,
            rate: Math.round(rate * 100) / 100,
        };
    });
};