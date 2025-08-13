import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast, type Id } from 'react-toastify';
import {vi, type MockInstance, expect} from 'vitest';
import { store } from '@/store';
import { Login } from '@/pages/login';
import { Signup } from '@/pages/signup';

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

const mockLoginUser = vi.fn();
vi.mock('@/hooks/useLogin', () => ({
    useLogin: () => ({
        loginUser: mockLoginUser,
        isLoading: false,
    }),
}));

const mockSignupUser = vi.fn();
vi.mock('@/hooks/useSignup', () => ({
    useSignup: () => ({
        signupUser: mockSignupUser,
        isLoading: false,
    }),
}));

beforeEach(() => {
    toastSuccessSpy = vi.spyOn(toast, 'success').mockImplementation(() => 1 as Id);
    toastErrorSpy = vi.spyOn(toast, 'error').mockImplementation(() => 1 as Id);
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Login Test', () => {
    test('로그인 화면 렌더링', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('title')).toHaveTextContent('로그인');
        expect(screen.getByLabelText('ID'));
        expect(screen.getByLabelText('PW'));
        expect(screen.getByLabelText('button')).toHaveTextContent('로그인');
    });

    test('로그인 성공 화면 렌더링', async () => {
        mockLoginUser.mockResolvedValueOnce({ token: 'fake-token', userId: 1 });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: '1234' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith('로그인에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('아이디가 존재하지 않을 때 오류 출력', async () => {
        mockLoginUser.mockRejectedValueOnce(new Error('nonexist@test.com is not exist'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'nonexist@test.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: '1234' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('로그인 실패: nonexist@test.com is not exist');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test('비밀번호가 일치하지 않을 때 오류 출력', async () => {
        mockLoginUser.mockRejectedValueOnce(new Error('password is not matched'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('로그인 실패: password is not matched');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});

describe('Signup Test', () => {
    test('회원가입 화면 렌더링', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByLabelText('title')).toHaveTextContent('회원가입');
        expect(screen.getByLabelText('ID'));
        expect(screen.getByLabelText('PW'));
        expect(screen.getByLabelText('PW Confirmation'));
        expect(screen.getByLabelText('button')).toHaveTextContent('회원가입');
    });

    test('회원가입 성공 화면 렌더링', async () => {
        mockSignupUser.mockResolvedValueOnce({ email: 'newuser@example.com' });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'newuser@example.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('PW Confirmation'), { target: { value: '1234' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastSuccessSpy).toHaveBeenCalledWith('회원가입에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('아이디가 이미 존재할 때 오류 출력', async () => {
        mockSignupUser.mockRejectedValueOnce(new Error('has already been taken'));

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'dup@test.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('PW Confirmation'), { target: { value: '1234' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('회원가입 실패: has already been taken');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test('비밀번호가 일치하지 않을 때 오류 출력', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByLabelText('ID'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText('PW'), { target: { value: '1234' } });
        fireEvent.change(screen.getByLabelText('PW Confirmation'), { target: { value: '4321' } });
        fireEvent.click(screen.getByLabelText('button'));

        await waitFor(() => {
            expect(toastErrorSpy).toHaveBeenCalledWith('회원가입 실패: 비밀번호가 일치하지 않습니다.');
        });
    });
});

