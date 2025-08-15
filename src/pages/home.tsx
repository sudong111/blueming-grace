import {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "@/store";
import { setAssets } from "@/store/assetsSlice";
import { setDiaries } from "@/store/diariesSlice";
import { useDiaries } from "@/hooks/useDiaries";
import { useAssets } from "@/hooks/useAssets";
import { HomeView } from "@/components/homeView";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FaPlus } from "react-icons/fa";

export const Home = () => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    const token = useSelector((state: RootState) => state.login.token);
    const [isAssets, setIsAssets] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getDiaries, isLoading } = useDiaries();
    const { getAssets } = useAssets();

    useEffect(() => {
        if (isLoggedIn) {
            const loadAll = async () => {
                setShowProgress(true);
                setProgress(20);

                const [diariesResult, assetsResult] = await Promise.allSettled([
                    getDiaries(),
                    getAssets()
                ]);

                if (diariesResult.status === "fulfilled") {
                    dispatch(setDiaries(diariesResult.value));
                    setProgress(40);
                } else {
                    toast.error(`투자 일지 조회 실패: ${diariesResult.reason.message}`);
                }
                if (assetsResult.status === "fulfilled") {
                    if (!assetsResult.value || assetsResult.value.length === 0) {
                        setIsAssets(false);
                    } else {
                        dispatch(setAssets(assetsResult.value));
                        setIsAssets(true);
                    }
                    setProgress(70);
                } else {
                    toast.error(`투자 종목 조회 실패: ${assetsResult.reason.message}`);
                    setIsAssets(false);
                }
                setProgress(100);
                setTimeout(() => setShowProgress(false), 100);
            }

            loadAll();
        }
    }, [token]);

    return (
        <div className="view">
            <Progress value={progress} hidden={!showProgress}/>
            <HomeView isLoading= { isLoading } />
            <p className="absolute left-0 text-xl font-bold text-red-500"
               hidden={isAssets}
               aria-label="assets-alert-text"
            >* 종목 정보가 존재하지 않습니다. 관리자에게 문의하세요.</p>
            <Button
                variant="add"
                size="free"
                className="diary-add-button"
                onClick={() => navigate("/diary/add")}
                aria-label="add_diary_button"
            >
                <FaPlus className="diary-add-text" />
            </Button>
        </div>
    );
};