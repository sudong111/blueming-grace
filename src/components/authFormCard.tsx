import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface  AuthFormCardProps {
    action: (email: string, password: string) => void;
    type: "login" | "signup";
    isLoading: boolean;
}

export const AuthFormCard = ({ action, type, isLoading }: AuthFormCardProps) => {

    const isLoginPage = type === "login";
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordCheckRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const passwordCheck = passwordCheckRef.current?.value || "";

        if (!isLoginPage && password !== passwordCheck) {
            alert(`비밀번호가 일치하지 않습니다.`);
            return;
        }

        action(email, password);
    }


    return (
        <div className="card-container items-center">
            <Card className="w-[30rem] h-[20rem] flex flex-col">
                <CardHeader className="border-b p-5">
                    <CardTitle>
                        { isLoginPage ? "로그인" : "회원가입" }
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1">
                    <form className="flex flex-col h-full justify-between" onSubmit={ handleSubmit }>
                        <div className="flex flex-col gap-5">
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="id">ID</Label>
                                <Input
                                    id="id"
                                    type="text"
                                    placeholder="blueming@example.com"
                                    ref={ emailRef }
                                />
                            </div>
                            <div className="card-input-container">
                                <Label className="text-center" htmlFor="pw">PW</Label>
                                <Input
                                    id="pw"
                                    type="password"
                                    placeholder="password"
                                    ref={ passwordRef }
                                />
                            </div>
                            { isLoginPage ? <></> : (
                                <div className="card-input-container">
                                    <Label className="text-center" htmlFor="pw_check">PW Confirmation</Label>
                                    <Input
                                        id="pw_check"
                                        type="password"
                                        placeholder="password"
                                        ref={ passwordCheckRef }
                                    />
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            { isLoginPage ? "로그인" : "회원가입" }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}