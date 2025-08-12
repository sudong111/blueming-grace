import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDiaryAdd } from "@/hooks/useDiaryAdd";
import { useDiaryAssetsAdd } from "@/hooks/useDiaryAssetsAdd.tsx";
import { DiaryAddCard } from "@/components/diaryAddCard";
import type { AssetAddInterface, DiaryAddInterface } from "@/models/interface";
import {useState} from "react";

export const DiaryAdd = () => {
    const token = useSelector((state: RootState) => state.login.token);
    const navigate = useNavigate();
    const { insertDiary } = useDiaryAdd();
    const { insertDiaryAssets } = useDiaryAssetsAdd();
    const [isLoading, setIsLoading] = useState(false);

    const handleDiaryAdd = async (data : DiaryAddInterface, assets: AssetAddInterface[]) => {
        try {
            setIsLoading(true);

            const diary = await insertDiary(data, token);
            const diaryId = diary.id;

            const promises = assets.map(asset =>
                insertDiaryAssets(diaryId, asset, token)
            );

            await Promise.all(promises);

            alert("투자 일정 등록에 성공했습니다.");
            navigate("/");
        } catch (e) {
            const error = e as Error;
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="view justify-center">
            <DiaryAddCard
                action={ handleDiaryAdd } isLoading={ isLoading }
            />
        </div>
    )
}