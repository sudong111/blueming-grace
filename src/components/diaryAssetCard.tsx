import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {ComputedAssetInterface} from "@/models/interface.ts";

interface DiaryAssetCardProps {
    asset: ComputedAssetInterface
}

export const DiaryAssetCard = ({ asset }: DiaryAssetCardProps) => {
    return (
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
    );
}