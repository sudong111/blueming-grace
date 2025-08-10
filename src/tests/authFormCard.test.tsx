import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AuthFormCard from '@/components/authFormCard';
import { vi, afterEach, beforeEach, type MockInstance } from 'vitest';

global.fetch = vi.fn();

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const originalModule = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
    };
});

describe('AuthFormCard - 로그인', () => {
    let alertSpy: MockInstance<((message?: string) => void)>;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.clearAllMocks();
        vi.mocked(fetch).mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('성공적으로 로그인이 완료되면 alert 호출 및 페이지 이동', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ token: 'fake-token', user_id: 1 }),
        } as Response);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={true} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const submitBtn = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(pwInput, { target: { value: '1234' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('로그인에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('아이디가 존재하지 않을 때 alert 호출', async () => {
        const email = 'nonexistent@email.com';

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 200,
            json: async () => ({ error: true, message: `${email} is not exist` }),
        } as Response);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={true} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const submitBtn = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(pwInput, { target: { value: 'password123' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(`${email} is not exist`);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test('비밀번호가 일치하지 않을 때 alert 호출', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 200,
            json: async () => ({ error: true, message: 'password is not matched' }),
        } as Response);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={true} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const submitBtn = screen.getByRole('button', { name: 'Login' });

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(pwInput, { target: { value: 'wrong-password' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('password is not matched');
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});

describe('AuthFormCard - 회원가입', () => {
    let alertSpy: MockInstance<((message?: string) => void)>;

    beforeEach(() => {
        alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.clearAllMocks();
        vi.mocked(fetch).mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('성공적으로 회원가입이 완료되면 alert 호출 및 페이지 이동', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            status: 201,
            json: async () => ({ user: { email: 'newuser@example.com' } }),
        } as Response);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={false} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const pwConfirmInput = screen.getByLabelText('PW Confirmation');
        const submitBtn = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
        fireEvent.change(pwInput, { target: { value: 'password123' } });
        fireEvent.change(pwConfirmInput, { target: { value: 'password123' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('회원가입에 성공했습니다.');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('회원가입시 입력한 비밀번호와 비밀번호 체크가 다를 때 alert 호출', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={false} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const pwConfirmInput = screen.getByLabelText('PW Confirmation');
        const submitBtn = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(pwInput, { target: { value: '1234' } });
        fireEvent.change(pwConfirmInput, { target: { value: '4321' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다.');
        });
    });

    test('회원가입시 입력한 아이디가 이미 존재할 때 alert 호출', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 422,
            json: async () => ({ email: 'has already been taken' }),
        } as Response);

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <AuthFormCard isLoginPage={false} />
                </BrowserRouter>
            </Provider>
        );

        const emailInput = screen.getByLabelText('ID');
        const pwInput = screen.getByLabelText('PW');
        const pwConfirmInput = screen.getByLabelText('PW Confirmation');
        const submitBtn = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(emailInput, { target: { value: 'duplication@test.com' } });
        fireEvent.change(pwInput, { target: { value: '1234' } });
        fireEvent.change(pwConfirmInput, { target: { value: '1234' } });

        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('has already been taken');
        });
    });
});