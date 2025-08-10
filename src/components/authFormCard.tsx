import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useSignup } from "@/hooks/useSignup";
import {toast} from "react-toastify";

interface  AuthFormCardProps {
    isLoginPage: boolean;
}

export default function AuthFormCard({ isLoginPage }: AuthFormCardProps) {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordCheckRef = useRef<HTMLInputElement>(null);
    const { loginUser } = useLogin();
    const { signupUser } = useSignup();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        if(isLoginPage) {
            loginUser(email, password);
        }
        else {
            const passwordCheck = passwordCheckRef.current?.value || "";
            if (password !== passwordCheck) {
                toast.error(`비밀번호가 일치하지 않습니다.`);
                return;
            }
            signupUser(email, password);
        }
    }

    return (
        <div className="card-container">
            <Card className="w-full max-w-[26rem]">
                <CardHeader>
                    <CardTitle>
                        {isLoginPage ? "Login" : "Sign up"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="email">ID</Label>
                                <Input
                                    id="id"
                                    type="email"
                                    placeholder="blueming@example.com"
                                    required
                                    ref={emailRef}
                                />
                            </div>
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="password">PW</Label>
                                <Input
                                    id="pw"
                                    type="password"
                                    placeholder="password"
                                    required
                                    ref={passwordRef}
                                />
                            </div>
                            {isLoginPage ? null : (
                                <div className="card-input-container">
                                    <Label className="text-center" htmlFor="password">PW Confirmation</Label>
                                    <Input
                                        id="password_check"
                                        type="password"
                                        placeholder="password"
                                        required
                                        ref={passwordCheckRef}
                                    />
                                </div>
                            )}
                            <Button type="submit" className="w-full">
                                {isLoginPage ? "Login" : "Sign up"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}