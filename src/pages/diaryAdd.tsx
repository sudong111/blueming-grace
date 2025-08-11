import { DiaryAddCard } from "@/components/diaryAddCard";
import { useNavigate } from "react-router-dom";
import { useDiaryAdd } from "@/hooks/useDiaryAdd";
import type { DiaryAddInterface } from "@/models/interface";

export const DiaryAdd = () => {
    const navigate = useNavigate();
    const { insertDiary, isLoading } = useDiaryAdd();

    const handleDiaryAdd = async (data : DiaryAddInterface) => {
        try {
            await insertDiary(data);

            alert("투자 일정 등록에 성공했습니다.");
            navigate("/");
        } catch (e) {
            const error = e as Error;
            alert(error.message);
        }
    }


    return (
        <DiaryAddCard
            action={ handleDiaryAdd } isLoading={isLoading}
        />
    )
}