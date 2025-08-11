import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiaryInterface } from "@/models/interface";

interface DiaryCardProps {
    diary: DiaryInterface
}

export const InvestmentDiaryCard = ({ diary }: DiaryCardProps) => {
    return (
        <div className="card-container items-start">
            <Card className="w-full h-[20rem] flex flex-col">
                <CardHeader className="border-b p-5">
                    <CardTitle>{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto p-5 flex-1">
                    <p>{diary.contents}</p>
                </CardContent>
            </Card>
        </div>
    );
};