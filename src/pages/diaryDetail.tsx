import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import {useNavigate, useParams} from "react-router-dom";
import type { RootState } from '@/store';
import { useDiaryAssets } from "@/hooks/useDiaryAssets";
import { computeAssets } from '@/utils/computedAsset';
import { DiaryDetailCard } from "@/components/diaryDetailCard";
import type { ComputedAssetInterface } from "@/models/interface";
import {Button} from "@/components/ui/button.tsx";
import {FaTrashAlt} from "react-icons/fa";
import {ConfirmDialog} from "@/components/confirmDialog.tsx";
import {useDiaryDelete} from "@/hooks/useDiaryDelete.tsx";
import {useDiaryAssetsDelete} from "@/hooks/useDiaryAssetsDelete.tsx";

export const DiaryDetail = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [computedAssets, setComputedAssets] = useState<ComputedAssetInterface[]>([]);
    const diaries = useSelector((state: RootState) => state.diaries.data);
    const navigate = useNavigate();
    const assets = useSelector((state: RootState) => state.assets);
    const { id } = useParams<{ id: string }>();
    const diary = diaries.find(diary => diary.id.toString() === id);
    const { getDiaryAssets } = useDiaryAssets(diary ? diary.id : -1);
    const { deleteDiary } = useDiaryDelete();
    const { deleteDiaryAssets } = useDiaryAssetsDelete();

    const handleDeleteDiary = async () => {
        try {
            if(!diary) {
                return new Error("투자 일지가 존재하지 않아 삭제에 실패했습니다.");
            }

            setIsDeleteLoading(true);
            const promises = computedAssets.map(asset =>
                deleteDiaryAssets(asset.id)
            );

            await Promise.all(promises);
            await deleteDiary(diary.id);

        } catch (e) {
            const error = e as Error;
            alert(error.message);
        } finally {
            setIsDeleteLoading(false);
        }
        setIsDialogOpen(false);
        alert("삭제 완료했습니다.");
        navigate("/");
    };

    useEffect(() => {
        if (!diary) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await getDiaryAssets();

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
            <DiaryDetailCard diary={diary || undefined} computedAssets={computedAssets} isLoading={isLoading} />
            {diary &&
                <>
                    <Button
                        variant="delete"
                        size="free"
                        className="diary-delete-button"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <FaTrashAlt className="diary-add-text" />
                    </Button>
                    <ConfirmDialog
                        type="Delete"
                        title="투자 일지 삭제"
                        contents={`정말 투자 일지 (${diary.title})를 삭제하시겠습니까?`}
                        open={isDialogOpen}
                        isDeleteLoading={isDeleteLoading}
                        onOpenChange={setIsDialogOpen}
                        onConfirm={handleDeleteDiary}
                    />
                </>
            }
        </div>

    );
};