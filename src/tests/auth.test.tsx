import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { Login } from '@/pages/login';
import { Signup } from '@/pages/signup';
import { vi, type MockInstance } from 'vitest';

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

let alertSpy: MockInstance<(message?: string) => void>;

beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Login Test', () => {
    test('로그인 성공 시 alert 호출 및 페이지 이동', async () => {
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
        fireEvent.click(screen.getByRole('button', { name: '로그인' }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('로그인에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });

        const state = store.getState();
        expect(state.login.token).toBe('fake-token');
        expect(state.login.userId).toBe(1);
    });

    test('로그인 실패 시 alert 호출', async () => {
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
        fireEvent.click(screen.getByRole('button', { name: '로그인' }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('password is not matched');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});

describe('Signup', () => {
    test('회원가입 성공 시 alert 호출 및 페이지 이동', async () => {
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
        fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('회원가입에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('비밀번호 불일치 시 alert 호출', async () => {
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
        fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다.');
        });
    });

    test('중복 이메일로 회원가입 실패 시 alert 호출', async () => {
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
        fireEvent.click(screen.getByRole('button', { name: '회원가입' }));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('has already been taken');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});

