import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import type {ComputedAssetInterface} from "@/models/interface.ts";

interface DiaryAssetCardProps {
    asset: ComputedAssetInterface
}

export const DiaryAssetCard = ({ asset }: DiaryAssetCardProps) => {
    let rate_class = '';

    if (asset.rate > 0) rate_class = 'text-red-500';
    else rate_class = 'text-blue-500';

    return (
        <Card key={asset.id} className="flex flex-col">
            <CardHeader className="p-2 text-center break-words whitespace-normal">
                <CardTitle><p>{asset.ticker}</p></CardTitle>
            </CardHeader>
            <CardContent className="p-2 break-words whitespace-normal">
                <div>
                    <p className="description-text">매수가</p>
                    <p>${asset.buy_price}</p>
                </div>
                <div>
                    <p className="description-text">현재가</p>
                    <p>${asset.present_price}</p>
                </div>
                <div>
                    <p className="description-text">수익률</p>
                    <p className={rate_class}>{asset.rate}%</p>
                </div>
            </CardContent>
        </Card>
    );
}