import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type AssetAddInterface } from "@/models/interface"


export const AddAsset = () => {
    const [assets, setAssets] = useState<AssetAddInterface[]>([]);

    const insertAddAssetField = () => {
        setAssets((prev) => [...prev, { ticker: "", amount: 0, buy_price: 0 }]);
    }

    const deleteAddAssetField = (index: number) => {
        setAssets((prevAsset) =>
            prevAsset.filter((_, i) => i !== index));
    }

    const handleChange = (index: number, field: keyof AssetAddInterface, value: string) => {
        setAssets((prevAsset) =>
            prevAsset.map((asset, i) =>
                i === index
                    ? { ...asset, [field]: field === "ticker" ? value : Number(value) }
                    : asset
            )
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[30%_30%_30%_10%] justify-items-center items-center">
                <Label>종목 티커명</Label>
                <Label>수량</Label>
                <Label>매수 가격</Label>
                <Button type="button" onClick={ insertAddAssetField }>+</Button>
            </div>
            {assets.map((asset, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[30%_30%_30%_10%] justify-items-center"
                >
                    <Input
                        id={`ticker-${index}`}
                        type="text"
                        value={asset.ticker}
                        onChange={(e) => handleChange(index, "ticker", e.target.value)}
                        className="max-w-24"
                    />
                    <Input
                        id={`amount-${index}`}
                        type="number"
                        value={asset.amount || ""}
                        onChange={(e) => handleChange(index, "amount", e.target.value)}
                        className="max-w-24"
                    />
                    <Input
                        id={`buy_price-${index}`}
                        type="number"
                        value={asset.buy_price || ""}
                        onChange={(e) => handleChange(index, "buy_price", e.target.value)}
                        className="max-w-24"
                    />
                    <Button variant="ghost" type="button" onClick={ () => deleteAddAssetField(index) }>
                        X
                    </Button>
                </div>
            ))}
        </div>
    )
}