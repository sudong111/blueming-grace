export interface loginInterface {
    token: string | null;
    userId: number;
    isLoggedIn: boolean;
}

export interface DiaryInterface {
    id: number;
    title: string;
    contents: string;
    date: string;
}

export interface AssetInterface {
    id: number;
    ticker: string;
    name: string;
    price: number;
}

export interface DiaryAssetInterface {
    id: number;
    diary_id: number;
    asset_id: number;
    amount: number;
    buy_price: number;
}