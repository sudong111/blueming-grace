import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type AssetAddInterface } from "@/models/interface"

interface AddAssetProps {
    assets: AssetAddInterface[],
    onAssetsChange: (assets: AssetAddInterface[]) => void
}

export const AddAsset = ({assets, onAssetsChange} : AddAssetProps) => {
    const allAssets = useSelector((state: RootState) => state.assets.data);

    const insertAddAssetField = () => {
        onAssetsChange([...assets, { id: 0, amount: 0, buy_price: 0 }]);
    }

    const deleteAddAssetField = (index: number) => {
        onAssetsChange(assets.filter((_, i) => i !== index));
    }

    const handleChange = (index: number, field: keyof AssetAddInterface, value: string) => {
        onAssetsChange(
            assets.map((asset, i) =>
                i === index
                    ? { ...asset, [field]: Number(value) }
                    : asset
            )
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[30%_30%_30%_10%] justify-items-center items-center">
                <Label aria-label="ticker_title">종목 티커명</Label>
                <Label aria-label="amount_title">수량</Label>
                <Label aria-label="buy_price_title">매수 가격</Label>
                <Button type="button" onClick={ insertAddAssetField } aria-label="insert_asset_button">+</Button>
            </div>
            {assets.map((asset, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[30%_30%_30%_10%] justify-items-center"
                >
                    <Select
                        value={asset.id ? asset.id.toString() : ''}
                        onValueChange={(value) => handleChange(index, "id", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {allAssets.map((a) => (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                    {a.ticker}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        id={`amount-${index}`}
                        type="number"
                        value={asset.amount || ""}
                        onChange={(e) => handleChange(index, "amount", e.target.value)}
                        min={0}
                        className="max-w-24"
                        aria-label="amount"
                    />
                    <Input
                        id={`buy_price-${index}`}
                        type="number"
                        value={asset.buy_price || ""}
                        onChange={(e) => handleChange(index, "buy_price", e.target.value)}
                        min={0}
                        className="max-w-24"
                        aria-label="buy_price"
                    />
                    <Button variant="ghost" type="button" onClick={ () => deleteAddAssetField(index) }>
                        X
                    </Button>
                </div>
            ))}
        </div>
    )
}