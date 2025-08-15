import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from '@/store';
import { useDiaryAssets } from "@/hooks/useDiaryAssets";
import { useDiaryDelete } from "@/hooks/useDiaryDelete";
import { useDiaryAssetsDelete } from "@/hooks/useDiaryAssetsDelete";
import { computeAssets } from '@/utils/computedAsset';
import { DiaryDetailCard } from "@/components/diaryDetailCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/confirmDialog";
import { FaTrashAlt } from "react-icons/fa";
import type { ComputedAssetInterface } from "@/models/interface";

export const DiaryDetail = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const diaries = useSelector((state: RootState) => state.diaries.data);
    const assets = useSelector((state: RootState) => state.assets);
    const { id } = useParams<{ id: string }>();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [computedAssets, setComputedAssets] = useState<ComputedAssetInterface[]>([]);

    const { deleteDiary } = useDiaryDelete();
    const { deleteDiaryAssets } = useDiaryAssetsDelete();

    const diary = diaries.find(diary => diary.id.toString() === id);
    const { getDiaryAssets } = useDiaryAssets(diary ? diary.id : -1);

    const handleDeleteDiary = async () => {
        if(!diary) {
            toast.error("투자 일지 삭제 실패: 투자 일지가 존재하지 않습니다.");
            return;
        }
        try {
            setIsDeleteLoading(true);
            const promises = computedAssets.map(asset =>
                deleteDiaryAssets(asset.id)
            );

            await Promise.all(promises);
            await deleteDiary(diary.id);

        } catch (e) {
            const error = e as Error;
            toast.error(`투자 일지 삭제 실패: ${error.message}`);
        } finally {
            setIsDeleteLoading(false);
            setIsDialogOpen(false);
        }
        toast.success(`투자 일지(${diary.title})를 성공적으로 삭제했습니다.`);
        navigate("/");
    };

    useEffect(() => {
        if (!diary) return;
        if (isLoggedIn) {
            const loadData = async () => {
                setShowProgress(true);
                setIsLoading(true);
                setProgress(20);

                try {
                    const data = await getDiaryAssets();
                    setProgress(40);

                    setComputedAssets(computeAssets(data, assets.data));
                    setProgress(70);

                } catch (e) {
                    const error = e as Error;
                    toast.error(`투자 종목 조회 실패: ${error.message}`);
                } finally {
                    setIsLoading(false);
                    setProgress(100);
                    setTimeout(() => setShowProgress(false), 100);
                }
            };

            loadData();
        }
    }, [diary, assets.data]);

    return (
        <div className="view justify-center">
            <Progress value={progress} hidden={!showProgress}/>
            <DiaryDetailCard diary={diary || undefined} computedAssets={computedAssets} isLoading={isLoading} />
            {diary &&
                <>
                    <Button
                        variant="delete"
                        size="free"
                        className="diary-delete-button"
                        onClick={() => setIsDialogOpen(true)}
                        aria-label="button"
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