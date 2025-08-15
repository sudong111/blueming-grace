import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast, type Id } from "react-toastify";
import {vi, type MockInstance, expect} from 'vitest';
import { store } from '@/store';
import { login } from '@/store/loginSlice';
import { Home } from '@/pages/home';

let toastErrorSpy: MockInstance;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const originalModule = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
    };
});

const mockGetDiaries = vi.fn();
vi.mock('@/hooks/useDiaries', () => ({
    useDiaries: () => ({
        getDiaries: mockGetDiaries,
        isLoading: false
    })
}));

const mockGetAssets = vi.fn();
vi.mock('@/hooks/useAssets', () => ({
    useAssets: () => ({getAssets: mockGetAssets})
}));

const mockLoginUser = vi.fn();
vi.mock('@/hooks/useLogin', () => ({
    useLogin: () => ({
        loginUser: mockLoginUser,
        isLoading: false,
    }),
}));

beforeEach(() => {
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1 as Id);
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Home Test', () => {
    test('투자 일지가 없을 때 화면 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetDiaries.mockResolvedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('alert_text')).toHaveTextContent('작성된 투자 일지가 없습니다.');
    });

    test('투자 종목이 없을 때 화면 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetAssets.mockRejectedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('assets-alert-text')).toHaveTextContent('* 종목 정보가 존재하지 않습니다. 관리자에게 문의하세요.');
    });

    test('투자 일지 추가 버튼 클릭시 페이지 이동', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetDiaries.mockResolvedValueOnce([]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );
        fireEvent.click(screen.getByLabelText('add_diary_button'));
        expect(mockNavigate).toHaveBeenCalledWith('/diary/add');
    });

    test('투자 일지 조회 성공시 화면 렌더링', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetDiaries.mockResolvedValueOnce([{ id: 1, title: '첫 투자 일지', contents: '내용', date: '2025-08-11' }]);
        mockGetAssets.mockResolvedValueOnce([{ id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 100 }]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('date')).toHaveTextContent('2025. 8. 11.');
            expect(screen.getByLabelText('title')).toHaveTextContent('첫 투자 일지');
            expect(screen.getByLabelText('contents')).toHaveTextContent('내용');
        });

        expect(mockGetAssets).toHaveBeenCalled();
    });

    test('토큰 없이 투자 일지 조회 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        mockGetDiaries.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 조회 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 일지 조회 에러 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetDiaries.mockRejectedValueOnce(new Error('관리자에게 문의하세요.'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 조회 실패: 관리자에게 문의하세요.');
        });
    });

    test('토큰 없이 투자 종목 조회 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        mockGetAssets.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 종목 조회 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 종목 조회 에러 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockGetAssets.mockRejectedValueOnce(new Error('관리자에게 문의하세요.'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('assets-alert-text')).toHaveTextContent('* 종목 정보가 존재하지 않습니다. 관리자에게 문의하세요.');
        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 종목 조회 실패: 관리자에게 문의하세요.');
        });
    });
});