import { DiaryAssetCard } from "@/components/diaryAssetCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComputedAssetInterface, DiaryInterface } from "@/models/interface";

interface DiaryDetailViewProps {
    diary: DiaryInterface | undefined,
    computedAssets: ComputedAssetInterface[],
    isLoading: boolean
}

export const DiaryDetailCard = ({diary, computedAssets, isLoading}: DiaryDetailViewProps) => {
    let diaryAssetCard;
    if(!diary) {
        return <p className="p-4" aria-label="alert_text">해당 투자 일지를 찾을 수 없습니다.</p>;
    }
    if(isLoading) {
        return <p className="p-4" aria-label="alert_text">투자 일지를 불러오는 중...</p>;
    }

    const titleText = diary.title.length === 0 ? '제목 없음' : diary.title;
    const contentsText = diary.contents.length === 0 ? '내용 없음' : diary.contents;

    if (computedAssets.length === 0) {
        diaryAssetCard = <p className="text-nowrap" aria-label="diary_assets_alert_text">투자한 종목이 없습니다.</p>;
    } else {
        diaryAssetCard = (computedAssets.map(asset => (
            <DiaryAssetCard key={asset.id} asset={asset} />
        )));
    }

    return (
        <div className="card-container items-center max-w-[40rem] w-full mx-auto">
            <Card className="flex flex-col w-full">
                <CardHeader className="text-center">
                    <CardTitle className="pb-2 text-2xl" aria-label="date">{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col max-w-2xl p-5 flex-1 gap-10">
                    <div className="border-b pb-2">
                        <p className="description-text">title</p>
                        <p className="font-bold text-xl" aria-label="title">{ titleText }</p>
                    </div>
                    <div>
                        <p className="description-text pb-2">contents</p>
                        <div className="border rounded-md p-3">
                            <p aria-label="contents">{ contentsText }</p>
                        </div>
                    </div>
                    <div>
                        <p className="description-text pb-2">투자한 종목들</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            { diaryAssetCard }
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}