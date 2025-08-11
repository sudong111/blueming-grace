import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDairy } from "@/store/diariesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiaryInterface } from "@/models/interface";

interface DiaryCardProps {
    diary: DiaryInterface
}

export const DiaryCard = ({ diary }: DiaryCardProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const titleText = diary.title.length === 0
        ? '제목 없음'
        : `<${ diary.title }>`;

    const contentsText = diary.contents.length === 0
        ? '내용 없음'
        : diary.contents;


    const handleClick = () => {
        dispatch(setDairy(diary));
        navigate(`/diary/${ diary.id }`);
    };
    return (
        <div className="card-container items-start" onClick={handleClick}>
            <Card className="w-full h-[20rem] flex flex-col hover:bg-gray-100">
                <CardHeader className="border-b p-5">
                    <CardTitle>{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto p-5 flex-1">
                    <p className="mb-2 font-bold">{ titleText }</p>
                    <p>{ contentsText }</p>
                </CardContent>
            </Card>
        </div>
    );
};