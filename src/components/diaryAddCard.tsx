import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AddAsset } from "@/components/addAsset";
import type { DiaryAddInterface } from "@/models/interface";

interface DiaryAddCardProps {
    action: (data: DiaryAddInterface) => void;
    isLoading: boolean;
}

export const DiaryAddCard = ({ action, isLoading}: DiaryAddCardProps) => {

    const titleRef = useRef<HTMLInputElement | null>(null);
    const contentsRef = useRef<HTMLTextAreaElement | null>(null);
    const dateRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = titleRef.current?.value || "";
        const contents = contentsRef.current?.value || "";
        const date = dateRef.current?.value || "";

        const formData: DiaryAddInterface = { title, contents, date };
        action(formData);
    }

    return (
        <div className="card-container">
            <Card className="min-w-96">
                <CardHeader className="border-b p-5">
                    <CardTitle>투자 일지 등록</CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                    <form className="flex flex-col gap-5" onSubmit={ handleSubmit }>
                        <div className="flex flex-col">
                            <Label className="mb-2" htmlFor="date">투자 날짜</Label>
                            <Input
                                id="date"
                                type="date"
                                ref={ dateRef }
                            ></Input>
                        </div>
                        <div className="flex flex-col">
                            <Label className="mb-2" htmlFor="title">투자 일지 제목</Label>
                            <Input
                                id="title"
                                type="text"
                                ref={ titleRef }
                            ></Input>
                        </div>
                        <div className="flex flex-col">
                            <Label className="mb-2" htmlFor="contents">투자 일지 내용</Label>
                            <Textarea
                                id="contents"
                                className="min-h-28"
                                ref={ contentsRef }
                            ></Textarea>
                        </div>
                        <AddAsset/>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            투자 일지 저장
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}