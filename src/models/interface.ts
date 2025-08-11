export interface loginInterface {
    token: string | null;
    userId: number;
    isLoggedIn: boolean;
}

export interface diaryInterface {
    id: number;
    title: string;
    contents: string;
    date: string;
}

export interface assetInterface {
    id: number;
    ticker: string;
    name: string;
    price: number;
}

export interface diaryAssetInterface {
    id: number;
    diary_id: number;
    asset_id: number;
    amount: number;
    buy_price: number;
}

export interface computedAssetInterface {
    id: number,
    ticker: string,
    buy_price: number,
    present_price: number,
    rate: number
}