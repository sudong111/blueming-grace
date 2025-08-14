import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast, type Id } from 'react-toastify';
import { vi, type MockInstance, expect } from 'vitest';
import { store } from '@/store';
import { login } from "@/store/loginSlice";
import { setDiaries } from "@/store/diariesSlice";
import { setAssets } from "@/store/assetsSlice";
import { DiaryDetail } from '@/pages/diaryDetail';

let toastSuccessSpy: MockInstance;
let toastErrorSpy: MockInstance;

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const originalModule = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

const mockGetDiaryAssets = vi.fn();
vi.mock('@/hooks/useDiaryAssets', () => ({
    useDiaryAssets: () => ({ getDiaryAssets: mockGetDiaryAssets }),
}));

const mockDeleteDiary = vi.fn();
vi.mock('@/hooks/useDiaryDelete', () => ({
    useDiaryDelete: () => ({ deleteDiary: mockDeleteDiary }),
}));

const mockDeleteDiaryAssets = vi.fn();
vi.mock('@/hooks/useDiaryAssetsDelete', () => ({
    useDiaryAssetsDelete: () => ({ deleteDiaryAssets: mockDeleteDiaryAssets }),
}));

beforeEach(() => {
    toastSuccessSpy = vi.spyOn(toast, 'success').mockImplementation(() => 1 as Id);
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1 as Id);
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('DiaryDetail Test', () => {
    test('투자 일지가 없을 때 화면 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([]));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('alert_text')).toHaveTextContent('해당 투자 일지를 찾을 수 없습니다.');
    });

    test('투자 종목이 없을 때 화면 렌더링', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([]));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('diary_assets_alert_text')).toHaveTextContent('투자한 종목이 없습니다.');
        });
    });

    test('로딩 중일 때 화면 렌더링', () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        mockGetDiaryAssets.mockReturnValueOnce(new Promise(() => {}));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('alert_text')).toHaveTextContent(/투자 일지를 불러오는 중/);
    });

    test('투자 일지 및 투자 종목 조회시 화면 렌더링', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('date')).toHaveTextContent('2025. 8. 11.');
            expect(screen.getByLabelText('title')).toHaveTextContent('테스트 일지');
            expect(screen.getByLabelText('contents')).toHaveTextContent('내용');
            expect(screen.getAllByLabelText('ticker')[0]).toHaveTextContent('AAA');
            expect(screen.getAllByLabelText('ticker')[1]).toHaveTextContent('BBB');
            expect(screen.getAllByLabelText('amount')[0]).toHaveTextContent('10');
            expect(screen.getAllByLabelText('amount')[1]).toHaveTextContent('40');
            expect(screen.getAllByLabelText('buy_price')[0]).toHaveTextContent('400');
            expect(screen.getAllByLabelText('buy_price')[1]).toHaveTextContent('500');
            expect(screen.getAllByLabelText('present_price')[0]).toHaveTextContent('200');
            expect(screen.getAllByLabelText('present_price')[1]).toHaveTextContent('600');
            expect(screen.getAllByLabelText('rate')[0]).toHaveTextContent('-50%');
            expect(screen.getAllByLabelText('rate')[1]).toHaveTextContent('20%');
        });
    });

    test('토큰 없이 투자 종목 조회시 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        mockGetDiaryAssets.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 종목 조회 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 종목 조회시 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        mockGetDiaryAssets.mockRejectedValueOnce(new Error("관리자에게 문의하세요."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 종목 조회 실패: 관리자에게 문의하세요.');
        });
    });

    test('투자 일지 삭제 버튼 클릭시 Dialog 렌더링', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('button'));
            expect(screen.getByLabelText('dialog_title')).toHaveTextContent('투자 일지 삭제');
            expect(screen.getByLabelText('dialog_desc')).toHaveTextContent('Delete Dialog');
            expect(screen.getByLabelText('dialog_contents')).toHaveTextContent('정말 투자 일지 (테스트 일지)를 삭제하시겠습니까?');
            expect(screen.getByLabelText('dialog_cancel_button')).toHaveTextContent('Cancel');
            expect(screen.getByLabelText('dialog_approve_button')).toHaveTextContent('Delete');
        });
    });

    test('투자 일지 삭제 성공시 페이지 이동 및 알람 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByLabelText('button'));
        fireEvent.click(screen.getByLabelText('dialog_approve_button'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
        expect(toastSuccessSpy).toHaveBeenCalledWith('투자 일지(테스트 일지)를 성공적으로 삭제했습니다.');

    });

    test('토큰 없이 투자 일지 속 종목 삭제시 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);
        mockDeleteDiaryAssets.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('button'));
            fireEvent.click(screen.getByLabelText('dialog_approve_button'));
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 삭제 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 일지 속 종목 삭제시 에러 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);
        mockDeleteDiaryAssets.mockRejectedValueOnce(new Error("관리자에게 문의하세요."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('button'));
            fireEvent.click(screen.getByLabelText('dialog_approve_button'));
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 삭제 실패: 관리자에게 문의하세요.');
        });
    });

    test('토큰 없이 투자 일지 삭제시 에러 출력', async () => {
        store.dispatch(login({ token: '', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);
        mockDeleteDiary.mockRejectedValueOnce(new Error("token 이 존재하지 않습니다."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('button'));
            fireEvent.click(screen.getByLabelText('dialog_approve_button'));
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 삭제 실패: token 이 존재하지 않습니다.');
        });
    });

    test('투자 일지 삭제시 에러 출력', async () => {
        store.dispatch(login({ token: 'fake-token', user_id: 1 }));
        store.dispatch(setDiaries([{ id: 1, title: '테스트 일지', contents: '내용', date: '2025-08-11' }]));
        store.dispatch(setAssets([
            {id: 1, ticker: 'AAA', name: 'AAA_name', price: 200},
            {id: 2, ticker: 'BBB', name: 'BBB_name', price: 600},
        ]));
        mockGetDiaryAssets.mockReturnValueOnce([
            { id: 1, diary_id: 1, asset_id: 1, amount: 10, buy_price: 400 },
            { id: 2, diary_id: 1, asset_id: 2, amount: 40, buy_price: 500 }
        ]);
        mockDeleteDiary.mockRejectedValueOnce(new Error("관리자에게 문의하세요."));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryDetail />
                </BrowserRouter>
            </Provider>
        );

        await waitFor(() => {
            fireEvent.click(screen.getByLabelText('button'));
            fireEvent.click(screen.getByLabelText('dialog_approve_button'));
            expect(toastErrorSpy).toHaveBeenCalledWith('투자 일지 삭제 실패: 관리자에게 문의하세요.');
        });
    });
});

