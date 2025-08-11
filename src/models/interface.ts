export interface loginInterface {
    token: string | null;
    userId: number;
    isLoggedIn: boolean;
}
export interface userInterface {
    id: number;
    email: string;
}

export interface errorInterface {
    error: string,
    message: string,
    status: number
}

export interface DiaryInterface {
    id: number;
    title: string;
    contents: string;
    date: string;
}