import * as React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MdOutlineCancel } from "react-icons/md";
import type { AssetAddInterface, AssetsErrorInterface } from "@/models/interface"

interface AddAssetProps {
    assets: AssetAddInterface[],
    assetsError: AssetsErrorInterface[],
    onAssetsChange: (assets: AssetAddInterface[]) => void
    onAssetsErrorChange: React.Dispatch<React.SetStateAction<AssetsErrorInterface[]>>;
}

export const AddAsset = ({assets, assetsError, onAssetsChange, onAssetsErrorChange} : AddAssetProps) => {
    const allAssets = useSelector((state: RootState) => state.assets.data);

    const insertAddAssetField = () => {
        onAssetsChange([...assets, { id: 0, amount: 0, buy_price: 0 }]);
    }

    const deleteAddAssetField = (index: number) => {
        onAssetsChange(assets.filter((_, i) => i !== index));
        onAssetsErrorChange(assetsError.filter((_, i) => i !== index));
    }
    
    const clearAssetError = (index: number, fieldName: string) => {
        onAssetsErrorChange((newAssetsError) => {
            return newAssetsError.map((error: AssetsErrorInterface, i: number) => {
                if (i !== index) return error;

                const updateFieldIndex = error.field_index.filter((name: string) => name !== fieldName);

                return {
                    ...error,
                    field_index: updateFieldIndex,
                    isValid: updateFieldIndex.length === 0
                };
            })
        });
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

            <div className="flex flex-col gap-8">
                {assets.map((asset, index) => {
                    const error = assetsError.find((_,i) => i === index);

                    return (
                        <div key={index} className="grid grid-cols-[30%_30%_30%_10%] justify-items-center relative">
                            <Select
                                value={asset.id ? asset.id.toString() : ''}
                                onValueChange={(value) => handleChange(index, "id", value)}
                            >
                                <SelectTrigger
                                    className={error?.field_index.includes("티커") ? "border-red-500" : ""}
                                    onFocus={() => error?.field_index.includes("티커") && clearAssetError(index, "티커")}
                                >
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
                                id={`amount-${index}`} type="number" value={asset.amount || ""} min={0} aria-label="amount"
                                onChange={(e) => handleChange(index, "amount", e.target.value)}
                                className={`max-w-24 ${error?.field_index.includes("수량") ? "border-red-500" : ""} `}
                                onFocus={() => error?.field_index.includes("수량") && clearAssetError(index, "수량")}
                            />

                            <Input
                                id={`buy_price-${index}`} type="number" value={asset.buy_price || ""} min={0} aria-label="buy_price"
                                onChange={(e) => handleChange(index, "buy_price", e.target.value)}
                                className={`max-w-24 ${error?.field_index.includes("가격") ? "border-red-500" : ""} `}
                                onFocus={() => error?.field_index.includes("가격") && clearAssetError(index, "가격")}
                            />

                            <Button variant="ghost" type="button" onClick={() => deleteAddAssetField(index)} aria-label="delete_asset_button">
                                <MdOutlineCancel className="text-red-500" />
                            </Button>

                            {(error?.isValid === false) && (
                                <p
                                    id={`error-${index}`}
                                    className="absolute left-0 top-full mt-1 text-red-500 text-xs"
                                    aria-label="asset_error_text"
                                >
                                    {error.field_index.join(", ")} 을 입력해주세요.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}