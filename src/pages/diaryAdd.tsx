import { DiaryAddCard } from "@/components/diaryAddCard";
import { useNavigate } from "react-router-dom";
import { useDiaryAdd } from "@/hooks/useDiaryAdd";
import { useDiaryAssetsAdd } from "@/hooks/useDiaryAssetsAdd.tsx";
import type { AssetAddInterface, DiaryAddInterface } from "@/models/interface";

export const DiaryAdd = () => {
    const navigate = useNavigate();
    const { insertDiary } = useDiaryAdd();
    const { insertDiaryAssets } = useDiaryAssetsAdd();

    const handleDiaryAdd = async (data : DiaryAddInterface, assets: AssetAddInterface[]) => {
        try {
            const diary = await insertDiary(data);
            const diaryId = diary.id;

            const promises = assets.map(asset =>
                insertDiaryAssets(diaryId, asset)
            );

            await Promise.all(promises);

            alert("투자 일정 등록에 성공했습니다.");
            navigate("/");
        } catch (e) {
            const error = e as Error;
            alert(error.message);
        }
    }


    return (
        <div className="view justify-center">
            <DiaryAddCard
                action={ handleDiaryAdd }
            />
        </div>
    )
}