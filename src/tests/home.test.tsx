import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { login } from '@/store/loginSlice';
import { vi, type MockInstance } from 'vitest';
import { Home } from '@/pages/home';

const mockGetInvestmentDiaries = vi.fn();
vi.mock('@/hooks/useInvestmentDiaries', () => ({
    useInvestmentDiaries: () => ({
        getInvestmentDiaries: mockGetInvestmentDiaries,
        isLoading: false
    })
}));

const mockGetAssets = vi.fn();
vi.mock('@/hooks/useInvestmentAssets', () => ({
    useInvestmentAssets: () => ({
        getAssets: mockGetAssets
    })
}));

const mockLoginUser = vi.fn();
vi.mock('@/hooks/useLogin', () => ({
    useLogin: () => ({
        loginUser: mockLoginUser,
        isLoading: false,
    }),
}));

let alertSpy: MockInstance<(message?: string) => void>;

beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Home', () => {
    test('비로그인 시 "로그인이 필요합니다." 출력', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('로그인이 필요합니다.')).toBeInTheDocument();
    });

    test('투자 일지와 자산 불러오기 성공 시 렌더링', async () => {
        mockLoginUser.mockResolvedValueOnce({ token: 'fake-token', userId: 1 });
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));

        mockGetInvestmentDiaries.mockResolvedValueOnce([
            { id: 1, title: '첫 투자 일지', contents: '내용', date: '2025-08-11' }
        ]);
        mockGetAssets.mockResolvedValueOnce([{ id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 100 }]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/첫 투자 일지/)).toBeInTheDocument();
        });

        expect(mockGetAssets).toHaveBeenCalled();
    });

    test('투자 일지 없을 시 "작성된 투자 일지가 없습니다." 출력', async () => {
        mockLoginUser.mockResolvedValueOnce({ token: 'fake-token', userId: 1 });

        mockGetInvestmentDiaries.mockResolvedValueOnce([]);
        mockGetAssets.mockResolvedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('작성된 투자 일지가 없습니다.')).toBeInTheDocument();
        });
    });

    test('투자 일지 조회 실패 시 alert 호출', async () => {
        mockLoginUser.mockResolvedValueOnce({ token: 'fake-token', userId: 1 });

        mockGetInvestmentDiaries.mockRejectedValueOnce(new Error('조회 실패'));
        mockGetAssets.mockResolvedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('조회 실패');
        });
    });
});