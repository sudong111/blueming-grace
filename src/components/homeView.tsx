import {DiaryCard} from "@/components/diaryCard.tsx";
import {FaPlus} from "react-icons/fa";
import {Button} from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";

interface HomeViewProps {
    isLoggedIn: boolean,
    isLoading: boolean
}

export const HomeView = ({ isLoggedIn, isLoading }: HomeViewProps) => {
    const diaries = useSelector((state: RootState) => state.diaries.data)
    const navigate = useNavigate();

    if(!isLoggedIn) {
        return <div className="p-4">로그인이 필요합니다.</div>;
    }
    if(isLoading) {
        return <div className="p-4">투자 일지 목록을 불러오는 중...</div>;
    }
    if(diaries.length === 0) return <div className="p-4">작성된 투자 일지가 없습니다.</div>;

    return (
        <>
            <p className="text-2xl font-bold mb-4">투자 일지</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-4">
                {diaries.map(diary => (
                    <DiaryCard key={diary.id} diary={diary} />
                ))}
            </div>
            <Button
                variant="add"
                size="free"
                className="fixed right-10 bottom-10 w-12 h-12 sm:w-20 sm:h-20 lg:w-28 lg:h-28 opacity-100 flex items-center justify-center"
                onClick={() => navigate("/diary/add")}
            >
                <FaPlus className="text-white" />
            </Button>
        </>
    );
}