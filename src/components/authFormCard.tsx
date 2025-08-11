import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useLogin } from "@/hooks/useLogin";
import { useSignup } from "@/hooks/useSignup";

interface  AuthFormCardProps {
    isLoginPage: boolean;
}

export const AuthFormCard = ({ isLoginPage }: AuthFormCardProps) => {

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
                alert(`비밀번호가 일치하지 않습니다.`);
                return;
            }
            signupUser(email, password);
        }
    }

    return (
        <div className="card-container items-center">
            <Card className="w-[30rem] h-[20rem] flex flex-col">
                <CardHeader className="border-b p-5">
                    <CardTitle>
                        {isLoginPage ? "Login" : "Sign up"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                    <form className="flex flex-col h-full justify-between" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="id">ID</Label>
                                <Input
                                    id="id"
                                    type="text"
                                    placeholder="blueming@example.com"
                                    ref={emailRef}
                                />
                            </div>
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="pw">PW</Label>
                                <Input
                                    id="pw"
                                    type="password"
                                    placeholder="password"
                                    ref={passwordRef}
                                />
                            </div>
                            {isLoginPage ? null : (
                                <div className="card-input-container">
                                    <Label className="text-center" htmlFor="pw_check">PW Confirmation</Label>
                                    <Input
                                        id="pw_check"
                                        type="password"
                                        placeholder="password"
                                        ref={passwordCheckRef}
                                    />
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            {isLoginPage ? "Login" : "Sign up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}