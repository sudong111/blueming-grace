import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import type { ComputedAssetInterface, DiaryInterface } from "@/models/interface.ts";
import { DiaryAssetCard } from "@/components/diaryAssetCard.tsx";

interface DiaryDetailViewProps {
    diary: DiaryInterface | undefined,
    computedAssets: ComputedAssetInterface[],
    isLoading: boolean
}

export const DiaryDetailView = ({diary, computedAssets, isLoading}: DiaryDetailViewProps) => {
    let diaryAssetCard;
    if(!diary) {
        return <div className="p-4">해당 투자 일지를 찾을 수 없습니다.</div>;
    }
    if(isLoading) {
        return <div className="p-4">투자 일지를 불러오는 중...</div>;
    }

    const titleText = diary.title.length === 0 ? '제목 없음' : `<${ diary.title }>`;
    const contentsText = diary.contents.length === 0 ? '내용 없음' : diary.contents;

    if (computedAssets.length === 0) {
        diaryAssetCard = <p className="text-nowrap">투자한 종목이 없습니다.</p>;
    } else {
        diaryAssetCard = (computedAssets.map(asset => (
            <DiaryAssetCard key={asset.id} asset={asset} />
        )));
    }

    return (
        <div className="card-container items-center">
            <Card className="min-w-96 flex flex-col">
                <CardHeader className="w-full border-b p-5 text-center">
                    <CardTitle>{new Date(diary.date).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col max-w-2xl p-5 flex-1 text-center gap-3">
                    <div className="border mb-2 p-3">
                        <p className="font-bold">{ titleText }</p>
                    </div>
                    <div className="border p-3">
                        <p>{ contentsText }</p>
                    </div>
                    <p className="text-left">투자한 종목들</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        { diaryAssetCard }
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}