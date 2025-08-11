import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store} from '@/store';
import { vi } from 'vitest';
import { InvestmentDiaryDetail } from '@/pages/investmentDiaryDetail';
import { computeAssets } from "@/utils/computedAsset";

const mockGetDiaryAssets = vi.fn();
vi.mock('@/hooks/useInvestmentDiaryAssets', () => ({
    useInvestmentDiaryAssets: () => ({
        getDiaryAssets: mockGetDiaryAssets,
    }),
}));

store.dispatch({
    type: 'investmentDiary/setDairy',
    payload: {
        id: 1,
        title: '테스트 일지',
        contents: '내용',
        date: '2025-08-11',
    }
});

store.dispatch({
    type: 'assets/setAssets',
    payload: [
        {id: 1, ticker: 'AAA', price: 200},
        {id: 2, ticker: 'BBB', price: 600},
    ]
});

const mockDiaryAssets = [
    { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
    { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
];

const mockAssets = {
    data: [
        { id: 1, ticker: 'AAPL', name: '첫 번째 자산', price: 200 },
        { id: 2, ticker: 'TSLA', name: '두 번째 자산', price: 600 },
    ],
};

describe('InvestmentDiaryDetail & computedAsset', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('로딩 중일 때 메시지 출력', () => {
        mockGetDiaryAssets.mockReturnValueOnce(new Promise(() => {}));
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <InvestmentDiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/목록을 불러오는 중/)).toBeInTheDocument();
    });

    test('자산 목록이 잘 렌더링 되는지', async () => {
        mockGetDiaryAssets.mockResolvedValueOnce(mockDiaryAssets);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <InvestmentDiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/테스트 일지/)).toBeInTheDocument();
            expect(screen.getByText(/AAA/)).toBeInTheDocument();
            expect(screen.getByText(/\$400/)).toBeInTheDocument();
            expect(screen.getByText(/\$200/)).toBeInTheDocument();
            expect(screen.getByText(/BBB/)).toBeInTheDocument();
            expect(screen.getByText(/\$500/)).toBeInTheDocument();
            expect(screen.getByText(/\$600/)).toBeInTheDocument();
        });
    });

    test('자산이 없으면 "없음" 표시', async () => {
        mockGetDiaryAssets.mockResolvedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <InvestmentDiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('없음')).toBeInTheDocument();
        });
    });

    test('에러 발생 시 alert 호출', async () => {
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        mockGetDiaryAssets.mockRejectedValueOnce(new Error('에러 발생'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <InvestmentDiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('에러 발생');
        });
    });

    test('투자 일지 자산 정보가 없으면 빈 배열을 반환한다', () => {
        const result = computeAssets([], mockAssets.data);
        expect(result).toEqual([]);
    });

    test('전체 자산 정보가 없으면 빈 배열을 반환한다', () => {
        const result = computeAssets(mockDiaryAssets, []);
        expect(result).toEqual([]);
    });


    test('올바른 자산 데이터가 있으면 수익률을 계산한다', () => {

        const result = computeAssets(mockDiaryAssets, mockAssets.data);

        expect(result).toEqual([
            {
                id: 1,
                ticker: 'AAPL',
                buy_price: 400,
                present_price: 200,
                rate: -50,
            },
            {
                id: 2,
                ticker: 'TSLA',
                buy_price: 500,
                present_price: 600,
                rate: 20,
            }
        ]);
    });
});

