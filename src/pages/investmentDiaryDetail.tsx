import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const InvestmentDiaryDetail = () => {
    const diary = useSelector((state: RootState) => state.investmentDiary);
    const titleText = diary.title.length === 0
        ? '제목 없음'
        : `<${ diary.title }>`;

    const contentsText = diary.contents.length === 0
        ? '내용 없음'
        : diary.contents;
    return (
        <div className="card-container items-center">
            <Card className="w-[30rem] h-[20rem] flex flex-col">
                <CardHeader className="w-full border-b p-5 text-center">
                    <CardTitle>{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="w-full p-5 flex-1 text-center">
                    <div className="border mb-2">
                        <p className="font-bold">{ titleText }</p>
                    </div>
                    <div className="border">
                        <p>{ contentsText }</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}