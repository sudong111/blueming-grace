import { useSelector } from 'react-redux';
import type { RootState } from "@/store";
import axios, { AxiosError } from "axios";
import type { AssetInterface } from "@/models/interface";

export const useAssets = () => {
    const token = useSelector((state: RootState) => state.login.token);

    const getAssets = async () => {
        if (!token) {
            return [];
        }

        try {
            const response = await axios.get<AssetInterface[]>(
                "https://the-rich-coding-test1.herokuapp.com/assets.json",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            return response.data;

        } catch (e) {
            const message = (e instanceof AxiosError && e.response?.data?.message)
                ? e.response.data.message
                : (e as Error).message;
            throw new Error(message || "자산종목 정보 조회에 실패했습니다.");
        }
    }

    return { getAssets };
};