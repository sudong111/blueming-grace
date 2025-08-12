import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import type { RootState } from '@/store';
import { useDiaryAssets } from "@/hooks/useDiaryAssets";
import { computeAssets } from '@/utils/computedAsset';
import { DiaryDetailView } from "@/components/diaryDetailView";
import type { ComputedAssetInterface } from "@/models/interface";

export const DiaryDetail = () => {
    const token = useSelector((state: RootState) => state.login.token);
    const diaries = useSelector((state: RootState) => state.diaries.data);
    const assets = useSelector((state: RootState) => state.assets);
    const { id } = useParams<{ id: string }>();
    const diary = diaries.find(diary => diary.id.toString() === id);
    const [computedAssets, setComputedAssets] = useState<ComputedAssetInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getDiaryAssets } = useDiaryAssets(diary ? diary.id : -1);

    useEffect(() => {
        if (!diary) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await getDiaryAssets(token);

                setComputedAssets(computeAssets(data, assets.data));
            } catch (e) {
                alert((e as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [diary, assets.data]);

    return (
        <div className="view justify-center">
            <DiaryDetailView diary={diary || undefined} computedAssets={computedAssets} isLoading={isLoading} />
        </div>
    );
};