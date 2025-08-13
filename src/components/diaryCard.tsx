import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiaryInterface } from "@/models/interface";

interface DiaryCardProps {
    diary: DiaryInterface
}

export const DiaryCard = ({ diary }: DiaryCardProps) => {
    const navigate = useNavigate();
    const titleText = diary.title.length === 0 ? '제목 없음' : diary.title;
    const contentsText = diary.contents.length === 0 ? '내용 없음' : diary.contents;

    const handleClick = () => {
        navigate(`/diary/${ diary.id }`);
    };

    return (
        <div className="card-container items-start" onClick={handleClick}>
            <Card className="home-diary-card">
                <CardHeader className="text-center">
                    <CardTitle className="pb-2 text-xl" aria-label="date">{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col max-w-2xl p-5 flex-1 gap-5">
                    <div className="border-b pb-1">
                        <p className="description-text">title</p>
                        <p className="font-bold text-xl" aria-label="title">{ titleText }</p>
                    </div>
                    <div>
                        <p className="description-text pb-1">contents</p>
                        <div className="line-clamp-3">
                            <p aria-label="contents">{ contentsText }</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};