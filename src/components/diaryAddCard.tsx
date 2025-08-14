import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AddAsset } from "@/components/addAsset";
import type { AssetAddInterface, DiaryAddInterface } from "@/models/interface";

interface DiaryAddCardProps {
    action: (data: DiaryAddInterface, addAssets: AssetAddInterface[]) => void;
    isLoading: boolean;
}

export const DiaryAddCard = ({ action, isLoading }: DiaryAddCardProps) => {
    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const dateRef = useRef<HTMLInputElement | null>(null);
    const [assets, setAssets] = useState<AssetAddInterface[]>([]);

    const handleAssetsChange = (addAssets: AssetAddInterface[]) => {
        setAssets(addAssets);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current?.value || "";
        const contents = contentsRef.current?.value || "";
        const date = dateRef.current?.value || "";

        const formData: DiaryAddInterface = { title, contents, date };
        action(formData, assets);
    }

    return (
        <div className="card-container">
            <Card className="min-w-96">
                <CardHeader className="border-b p-5">
                    <CardTitle aria-label="header_title">투자 일지 등록</CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                    <form className="input-container gap-5" onSubmit={ handleSubmit }>
                        <div className="input-container">
                            <Label className="mb-2" htmlFor="date">투자 날짜</Label>
                            <Input id="date" type="date" ref={ dateRef } aria-label="date"></Input>
                        </div>
                        <div className="input-container">
                            <Label className="mb-2" htmlFor="title">투자 일지 제목</Label>
                            <Input id="title" type="text" ref={ titleRef } aria-label="title"></Input>
                        </div>
                        <div className="input-container">
                            <Label className="mb-2" htmlFor="contents">투자 일지 내용</Label>
                            <Textarea id="contents" className="min-h-28" ref={ contentsRef } aria-label="contents"></Textarea>
                        </div>
                        <AddAsset assets={assets} onAssetsChange={ handleAssetsChange } />
                        <Button type="submit" className="w-full" disabled={isLoading} aria-label="submit_button" >
                            <div hidden={!isLoading} className="spinner size-3"></div>
                            투자 일지 등록
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}