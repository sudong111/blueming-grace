import { InvestmentDiaryCard } from "@/components/investmentDiaryCard";
import { useInvestmentDiaries } from "@/hooks/useInvestmentDiaries";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {useEffect, useState} from "react";
import type {DiaryInterface} from "@/models/interface.ts";

export const Home = () => {
    const { isLoggedIn } = useSelector((state: RootState) => state.login);
    const token = useSelector((state: RootState) => state.login.token);
    const [diaries, setDiaries] = useState<DiaryInterface[]>([]);
    const { getInvestmentDiaries, isLoading } = useInvestmentDiaries();

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const loadDiaries = async () => {
            try {
                const data = await getInvestmentDiaries();
                setDiaries(data ?? []);

            } catch (e) {
                const error = e as Error;
                alert(error.message);
                return <div className="p-4 text-red-500">에러가 발생했습니다: {error.message}</div>;
            }
        };
        loadDiaries();
    }, [token]);


    if (!isLoggedIn) {
        return <div className="p-4">로그인이 필요합니다.</div>;
    }

    if (isLoading) {
        return <div className="p-4">투자 일지 목록을 불러오는 중...</div>;
    }

    if (diaries.length === 0) {
        return <div className="p-4">작성된 투자 일지가 없습니다.</div>;
    }

    return (
        <>
            <p className="text-2xl font-bold mb-4">투자 일지</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {diaries.map(diary => (
                    <InvestmentDiaryCard key={diary.id} diary={diary} />
                ))}
            </div>
        </>
    );
};