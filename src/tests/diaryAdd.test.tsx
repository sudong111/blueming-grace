import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast, type Id } from 'react-toastify';
import { vi, type MockInstance, expect } from 'vitest';
import { store } from '@/store';
import { login, logout } from "@/store/loginSlice";
import { DiaryAdd } from "@/pages/diaryAdd";

let toastSuccessSpy: MockInstance;
let toastErrorSpy: MockInstance;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const originalModule = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
    };
});

const mockInsertDiary = vi.fn();
vi.mock("@/hooks/useDiaryAdd", () => ({
    useDiaryAdd: () => ({ insertDiary: mockInsertDiary })
}));

const mockInsertDiaryAssets = vi.fn();
vi.mock("@/hooks/useDiaryAssetsAdd", () => ({
    useDiaryAssetsAdd: () => ({ insertDiaryAssets: mockInsertDiaryAssets })
}));

beforeEach(() => {
    toastSuccessSpy = vi.spyOn(toast, 'success').mockImplementation(() => 1 as Id);
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1 as Id);
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('DiaryAdd Test', () => {
    test('로그아웃일 때 화면 렌더링', () => {
        store.dispatch(logout());

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('alert_text')).toHaveTextContent('로그인이 필요합니다.');
    });

    test('투자 일지 등록 화면 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('header_title')).toHaveTextContent('투자 일지 등록');
        expect(screen.getByLabelText('date'))
        expect(screen.getByLabelText('title'))
        expect(screen.getByLabelText('contents'))
        expect(screen.getByLabelText('ticker_title')).toHaveTextContent('종목 티커명');
        expect(screen.getByLabelText('amount_title')).toHaveTextContent('수량');
        expect(screen.getByLabelText('buy_price_title')).toHaveTextContent('매수 가격');
        expect(screen.getByLabelText('insert_asset_button')).toHaveTextContent('+');
        expect(screen.getByLabelText('submit_button')).toHaveTextContent('투자 일지 등록');
    });

    test('종목 추가 버튼 클릭 시 새로운 자산 입력 필드 생성 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('insert_asset_button'));
        fireEvent.click(screen.getByLabelText('insert_asset_button'));

        expect(screen.queryAllByRole('combobox').length).toBe(2);
        expect(screen.getAllByLabelText('amount').length).toBe(2);
        expect(screen.getAllByLabelText('buy_price').length).toBe(2);
    });

    test('토큰 없이 투자 일지 추가시 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        mockInsertDiary.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('submit_button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 등록 실패: token 이 존재하지 않습니다.');
        });
    });

    test('토큰 없이 투자 종목 추가시 에러 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockInsertDiary.mockResolvedValueOnce({ id: 1 });
        mockInsertDiaryAssets.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('insert_asset_button'));
        fireEvent.change(screen.getByLabelText('amount'), { target: { value: 10 } });
        fireEvent.change(screen.getByLabelText('buy_price'), { target: { value: 400 } });

        fireEvent.click(screen.getByLabelText('submit_button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 등록 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 일지 추가 성공시 페이지 이동 및 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        mockInsertDiary.mockResolvedValueOnce({ id: 1 });
        mockInsertDiaryAssets.mockResolvedValueOnce(undefined);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('insert_asset_button'));
        fireEvent.click(screen.getByLabelText('insert_asset_button'));
        fireEvent.change(screen.getAllByLabelText('amount')[0], { target: { value: 10 } });
        fireEvent.change(screen.getAllByLabelText('amount')[1], { target: { value: 20 } });
        fireEvent.change(screen.getAllByLabelText('buy_price')[0], { target: { value: 400 } });
        fireEvent.change(screen.getAllByLabelText('buy_price')[1], { target: { value: 600 } });

        fireEvent.click(screen.getByLabelText('submit_button'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
        expect(toastSuccessSpy).toHaveBeenCalledWith('투자 일지 등록에 성공했습니다.');
    });
});

