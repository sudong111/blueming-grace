import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AddAsset } from "@/components/addAsset";
import type { AssetAddInterface, DiaryAddInterface, AssetsErrorInterface } from "@/models/interface";

interface DiaryAddCardProps {
    action: (data: DiaryAddInterface, addAssets: AssetAddInterface[]) => void;
    isLoading: boolean;
}

interface FormData {
    title: string;
    contents: string;
    date: string;
    assets: AssetAddInterface[];
}

export const DiaryAddCard = ({ action, isLoading }: DiaryAddCardProps) => {
    const { register, getValues, trigger, formState: { errors }, clearErrors } = useForm<FormData>({
        defaultValues: { assets: [] }
    });

    const [assets, setAssets] = useState<AssetAddInterface[]>([]);
    const [assetsError, setAssetsError] = useState<AssetsErrorInterface[]>([]);

    const handleAssetsChange = (addAssets: AssetAddInterface[]) => {
        setAssets(addAssets);
    };

    const handleAssetsErrorChange = (filteredAssetsError: AssetsErrorInterface[]) => {
        setAssetsError(filteredAssetsError);
    }

    const onSubmit = async () => {
        const result = validationAssets(assets);
        setAssetsError(result);


        const isFormValid = await trigger(["title", "contents", "date"]);

        if (isFormValid && !result.find(value => !value.isValid)) {
            const data = getValues();
            action({ title: data.title, contents: data.contents, date: data.date }, assets);
        }
    };

    const validationAssets = (assets: AssetAddInterface[]) => {
        const fieldNameMap: Record<string, string> = {
            id: "티커",
            amount: "수량",
            buy_price: "가격",
        };
        const param: AssetsErrorInterface[] = [];

        if (assets.length > 0) {
            assets.forEach((asset) => {
                const zeroFields = ["id", "amount", "buy_price"]
                    .map(name => asset[name as keyof typeof asset] === 0 ? fieldNameMap[name] : "")
                    .filter(name => name.length > 0);

                param.push({
                    field_index: zeroFields,
                    isValid: zeroFields.length === 0,
                });
            });
        }

        return param;
    }

    return (
        <div className="card-container">
            <Card className="min-w-96">
                <CardHeader className="border-b p-5">
                    <CardTitle aria-label="header_title">투자 일지 등록</CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                    <form className="input-container gap-8">

                        <div className="input-container">
                            <Label className="mb-2" htmlFor="date">투자 날짜</Label>
                            <Input id="date" type="date" aria-label="date"
                                   {...register("date", {
                                       required: "날짜를 입력해주세요",
                                   })}
                                   className={`w-full ${errors.date ? "border-red-500" : ""} `}
                                   onFocus={() => clearErrors("date")}
                            ></Input>
                            {errors.date && <p className="absolute left-0 top-full mt-1 text-red-500 text-xs">{errors.date.message}</p>}
                        </div>

                        <div className="input-container">
                            <Label className="mb-2" htmlFor="title">투자 일지 제목</Label>
                            <Input id="title" type="text" aria-label="title"
                                   {...register("title", {
                                       required: "제목를 입력해주세요",
                                   })}
                                   className={`w-full ${errors.title ? "border-red-500" : ""} `}
                                   onFocus={() => clearErrors("title")}
                            ></Input>
                            {errors.title && <p className="absolute left-0 top-full mt-1 text-red-500 text-xs">{errors.title.message}</p>}
                        </div>

                        <div className="input-container">
                            <Label className="mb-2" htmlFor="contents">투자 일지 내용</Label>
                            <Textarea id="contents" aria-label="contents"
                                      {...register("contents", {
                                          required: "내용를 입력해주세요",
                                      })}
                                      className={`min-h-28 ${errors.contents ? "border-red-500" : ""} `}
                                      onFocus={() => clearErrors("contents")}
                            ></Textarea>
                            {errors.contents && <p className="absolute left-0 top-full mt-1 text-red-500 text-xs">{errors.contents.message}</p>}
                        </div>

                        <AddAsset
                            assets={assets}
                            assetsError={assetsError}
                            onAssetsChange={ handleAssetsChange }
                            onAssetsErrorChange={handleAssetsErrorChange}/>

                        <Button type="button" className="w-full" disabled={isLoading} aria-label="submit_button" onClick={onSubmit}>
                            <div hidden={!isLoading} className="spinner size-3"></div>
                            투자 일지 등록
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}