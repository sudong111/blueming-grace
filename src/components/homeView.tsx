import {DiaryCard} from "@/components/diaryCard.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";

interface HomeViewProps {
    isLoading: boolean
}

export const HomeView = ({ isLoading }: HomeViewProps) => {
    const { isLoggedIn } = useSelector((state: RootState) => state.login);
    const diaries = useSelector((state: RootState) => state.diaries.data)


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
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-5">
                {diaries.map(diary => (
                    <DiaryCard key={diary.id} diary={diary} />
                ))}
            </div>
        </>
    );
}