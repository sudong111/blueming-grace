import {  Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from  "@/components/ui/button"

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="card-container">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="blueming@example.com"
                                    required
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
                                    required />
                            </div>
                            <a
                                onClick={() => navigate("/signup")}
                                className="inline-block text-sm cursor-pointer underline-offset-4 hover:underline"
                            >
                                sign-up
                            </a>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}