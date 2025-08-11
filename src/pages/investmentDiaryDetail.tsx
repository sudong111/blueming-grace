import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvestmentDiaryAssets } from "@/hooks/useInvestmentDiaryAssets";
import type { computedAssetInterface } from "@/models/interface";
import { computeAssets } from '@/utils/computedAsset';

export const InvestmentDiaryDetail = () => {
    const diary = useSelector((state: RootState) => state.investmentDiary);
    const assets = useSelector((state: RootState) => state.assets);
    const [computedAssets, setComputedAssets] = useState<computedAssetInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getDiaryAssets } = useInvestmentDiaryAssets(diary.id);
    const titleText = diary.title.length === 0
        ? '제목 없음'
        : `<${ diary.title }>`;

    const contentsText = diary.contents.length === 0
        ? '내용 없음'
        : diary.contents;

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await getDiaryAssets();

                setComputedAssets(computeAssets(data, assets.data));

            } catch (e) {
                const error = e as Error;
                alert(error.message);
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <div className="p-4">목록을 불러오는 중...</div>;
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
                        {computedAssets && computedAssets.length > 0 ? (
                            computedAssets.map(asset => (
                                <Card key={asset.id} className="flex flex-col">
                                    <CardHeader className="p-2 border-b break-words whitespace-normal">
                                        <CardTitle><p>{asset.ticker}</p></CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 break-words whitespace-normal">
                                        <p>매수가 : ${asset.buy_price}</p>
                                        <p>현재가</p>
                                        <p>${asset.present_price}</p>
                                        <p>수익률</p>
                                        <p>{asset.rate}%</p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p>없음</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}