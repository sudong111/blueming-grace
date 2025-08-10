import {  Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from  "@/components/ui/button"
import { useLogin } from "@/hooks/useLogin"
import {useRef} from "react";
import * as React from "react";

export default function Login() {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { loginUser } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        loginUser(email, password);
    }

    return (
        <div className="card-container">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="blueming@example.com"
                                    required
                                    ref={emailRef}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                    required
                                    ref={passwordRef}
                                />
                            </div>
                            <p
                                onClick={() => navigate("/signup")}
                                className="inline-block text-sm cursor-pointer underline-offset-4 hover:underline"
                            >
                                sign-up
                            </p>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}