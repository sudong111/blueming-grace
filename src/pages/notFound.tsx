import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AiOutlineFrown } from "react-icons/ai";


export const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col flex-1 justify-center gap-5 px-5">
            <p className="font-bold text-6xl text-gray-400">Sorry !</p>
            <div className="flex flex-col gap-1">
                <p className="description-text !text-xl">죄송합니다. 페이지를 찾을 수 없습니다.</p>
                <p className="description-text !text-xl">존재하지 않는 주소를 입력하셨거나</p>
                <p className="description-text !text-xl">요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
            </div>
            <Button variant="outline" className="w-[7.5rem] gray-button border-gray-300" onClick={() => navigate("/")}>홈으로 가기</Button>
            <div className="absolute right-0">
            < AiOutlineFrown className="text-[40rem] text-gray-200" />
            </div>
        </div>
    );
};