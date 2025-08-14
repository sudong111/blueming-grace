import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "@/store";
import { useDiaryAdd } from "@/hooks/useDiaryAdd";
import { useDiaryAssetsAdd } from "@/hooks/useDiaryAssetsAdd";
import { DiaryAddCard } from "@/components/diaryAddCard";
import type { AssetAddInterface, DiaryAddInterface } from "@/models/interface";

export const DiaryAdd = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const navigate = useNavigate();
    const { insertDiary } = useDiaryAdd();
    const { insertDiaryAssets } = useDiaryAssetsAdd();
    const [isLoading, setIsLoading] = useState(false);

    const handleDiaryAdd = async (data : DiaryAddInterface, assets: AssetAddInterface[]) => {
        if (isLoggedIn) {
            try {
                setIsLoading(true);

                const diary = await insertDiary(data);
                const diaryId = diary.id;

                const promises = assets.map(asset =>
                    insertDiaryAssets(diaryId, asset)
                );

                await Promise.all(promises);

                toast.success("투자 일지 등록에 성공했습니다.");
                navigate("/");
            } catch (e) {
                const error = e as Error;
                toast.error(`투자 일지 등록 실패: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="view justify-center">
            <DiaryAddCard action={handleDiaryAdd} isLoading={isLoading} />
        </div>
    );
}