import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store} from '@/store';
import {describe, vi} from 'vitest';
import { DiaryAdd } from "@/pages/diaryAdd";
import { AddAsset } from "@/components/addAsset";
import type { AssetAddInterface } from '@/models/interface';
import {login} from "@/store/loginSlice";

const mockInsertDiary = vi.fn();
vi.mock("@/hooks/useDiaryAdd", () => ({
    useDiaryAdd: () => ({
        insertDiary: mockInsertDiary,
    })
}));

const mockInsertDiaryAssets = vi.fn();
vi.mock("@/hooks/useDiaryAssetsAdd", () => ({
    useDiaryAssetsAdd: () => ({
        insertDiaryAssets: mockInsertDiaryAssets,
    })
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('DiaryAdd Test', () => {
    test('첫 화면 렌더링 확인', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd/>
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('투자 일지 등록')).toBeInTheDocument();
        expect(screen.getByLabelText('투자 날짜')).toBeInTheDocument();
        expect(screen.getByLabelText('투자 일지 제목')).toBeInTheDocument();
        expect(screen.getByLabelText('투자 일지 내용')).toBeInTheDocument();
        expect(screen.getByText('종목 티커명')).toBeInTheDocument();
        expect(screen.getByText('수량')).toBeInTheDocument();
        expect(screen.getByText('매수 가격')).toBeInTheDocument();
        expect(screen.getByText('투자 일지 저장')).toBeInTheDocument();
    });

    test('종목 추가 버튼 클릭 시 새로운 자산 입력 필드가 추가되는지', () => {
        let assets: AssetAddInterface[] = [];
        const onAssetsChange = (newAssets: AssetAddInterface[]) => {
            assets = newAssets;
            rerenderComponent();
        };

        const renderComponent = () =>
            render(
                <Provider store={store}>
                    <AddAsset assets={assets} onAssetsChange={onAssetsChange} />
                </Provider>
            );

        const utils = renderComponent();
        const rerenderComponent = () => {
            utils.rerender(
                <Provider store={store}>
                    <AddAsset assets={assets} onAssetsChange={onAssetsChange} />
                </Provider>
            );
        };

        // + 버튼 찾기
        const addButton = screen.getByRole('button', { name: '+' });
        expect(addButton).toBeInTheDocument();

        // 초기에는 입력 필드가 없다 (assets 배열이 비어있으므로)
        expect(screen.queryAllByRole('combobox').length).toBe(0);

        // 버튼 클릭
        fireEvent.click(addButton);

        // 새로운 Select 필드가 하나 생겼는지 확인
        expect(screen.getAllByRole('combobox').length).toBe(1);

        // 수량, 매수 가격 input 요소도 생겼는지 확인 (input[type=number]는 role spinbutton)
        expect(screen.getAllByRole('spinbutton').length).toBe(2);
    });

    test('모든 값을 넣고 저장했을 때 정상적으로 저장되는지', async () => {
        mockInsertDiary.mockResolvedValueOnce({ id: 123 });
        mockInsertDiaryAssets.mockResolvedValueOnce(undefined);
        store.dispatch(login({ token: 'mocked-token', user_id: 123 }));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <DiaryAdd />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('투자 날짜'), { target: { value: '2025-08-12' } });
        fireEvent.change(screen.getByLabelText('투자 일지 제목'), { target: { value: '테스트 제목' } });
        fireEvent.change(screen.getByLabelText('투자 일지 내용'), { target: { value: '테스트 내용' } });
        fireEvent.click(screen.getByRole('button', {name: '+'}));
        const amountInput = screen.getByLabelText(/수량/i);
        const buyPriceInput = screen.getByLabelText(/매수 가격/i);
        fireEvent.change(amountInput, { target: { value: 10 } });
        fireEvent.change(buyPriceInput, { target: { value: 400 } });
        fireEvent.click(screen.getByRole('button', { name: '투자 일지 저장' }));
        // 비동기 처리 기다리기
        await waitFor(() => {
            // insertDiary가 1번 호출되고 전달된 데이터 확인
            expect(mockInsertDiary).toHaveBeenCalledWith({
                title: '테스트 제목',
                contents: '테스트 내용',
                date: '2025-08-12',
            });

            // insertDiaryAssets가 diaryId와 자산 정보로 호출됨
            expect(mockInsertDiaryAssets).toHaveBeenCalledWith(123, {
                id: 0,
                amount: 10,
                buy_price: 400,
            });

            // alert 호출 확인
            expect(window.alert).toHaveBeenCalledWith('투자 일정 등록에 성공했습니다.');

            // navigate('/') 호출 확인
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });


});

