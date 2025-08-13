import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { setAssets } from "@/store/assetsSlice";
import { setDiaries } from "@/store/diariesSlice";
import { useDiaries } from "@/hooks/useDiaries";
import { useAssets } from "@/hooks/useAssets";
import { HomeView } from "@/components/homeView";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";

export const Home = () => {
    const { isLoggedIn } = useSelector((state: RootState) => state.login);
    const token = useSelector((state: RootState) => state.login.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getDiaries, isLoading } = useDiaries();
    const { getAssets } = useAssets();

    useEffect(() => {
        if (!isLoggedIn) return;

        const loadAll = async () => {
            try {
                const [diariesResult, assetsResult] = await Promise.all([
                    getDiaries(),
                    getAssets()
                ]);

                dispatch(setDiaries(diariesResult));
                dispatch(setAssets(assetsResult));
            } catch (e) {
                const error = e as Error;
                alert(error.message);
            }
        };

        loadAll();
    }, [token]);

    return (
        <div className="view">
            <HomeView isLoading= { isLoading } />
            {isLoggedIn &&
                <Button
                    variant="add"
                    size="free"
                    className="diary-add-button"
                    onClick={() => navigate("/diary/add")}
                >
                    <FaPlus className="diary-add-text" />
                </Button>
            }
        </div>
    );
};