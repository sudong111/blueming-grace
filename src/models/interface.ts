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