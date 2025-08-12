import axios, { AxiosError } from "axios";

export const useDiaryDelete = () => {

    const insertDiary = async (diary_id: number, token: string | null) => {
        if(!token) {
            throw new Error("token 이 존재하지 않아 투자 일정 삭제에 실패했습니다.");
        }

        try {
            const response = await axios.delete(
                `https://the-rich-coding-test1.herokuapp.com/diaries/${diary_id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return await response.data;

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.error)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "투자 일정 삭제에 실패했습니다.");
        }
    }
    return { insertDiary };
}