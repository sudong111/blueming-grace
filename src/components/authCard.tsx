import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuthCardProps {
    action: (email: string, password: string) => void;
    isLoginType: boolean;
    isLoading: boolean;
}

interface FormData {
    id: string;
    pw: string;
    pw_check?: string;
}

export const AuthCard = ({ action, isLoginType, isLoading }: AuthCardProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        if (!isLoginType && data.pw !== data.pw_check) {
            toast.error("회원가입 실패: 비밀번호가 일치하지 않습니다.");
            return;
        }
        action(data.id, data.pw);
    };

    return (
        <div className="card-container items-center max-w-[25rem] w-full mx-auto">
            <Card className="flex flex-col w-full gap-5">
                <CardHeader className="border-b p-5">
                    <CardTitle aria-label="title">{isLoginType ? "로그인" : "회원가입"}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex-1">
                    <form className="flex flex-col gap-20 justify-between" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-8">

                            <div className="card-input-wrapper relative">
                                <div className="card-input-container">
                                    <Label className="text-center" htmlFor="id">ID</Label>
                                    <Input
                                        id="id"
                                        type="text"
                                        placeholder="blueming@example.com"
                                        {...register("id", {
                                            required: "ID를 입력해주세요",
                                        })}
                                        className={`w-full ${errors.id ? "border-red-500" : ""} `}
                                    />
                                </div>
                                {errors.id && <p className="absolute left-[30%] top-full mt-1 text-red-500 text-xs">{errors.id.message}</p>}
                            </div>

                            <div className="card-input-wrapper relative">
                                <div className="card-input-container">
                                    <Label className="text-center" htmlFor="pw">PW</Label>
                                    <div>
                                        <Input
                                            id="pw"
                                            type="password"
                                            placeholder="password"
                                            {...register("pw", {
                                                required: "비밀번호를 입력해주세요",
                                            })}
                                            className={`w-full ${errors.pw ? "border-red-500" : ""} `}
                                        />
                                    </div>
                                </div>
                                {errors.pw && <p className="absolute left-[30%] top-full mt-1 text-red-500 text-xs">{errors.pw.message}</p>}
                            </div>

                            {!isLoginType && (
                                <div className="card-input-wrapper relative">
                                    <div className="card-input-container">
                                        <Label className="text-center" htmlFor="pw_check">PW Confirmation</Label>
                                        <Input
                                            id="pw_check"
                                            type="password"
                                            placeholder="password"
                                            {...register("pw_check", {
                                                required: "비밀번호 확인을 입력해주세요",
                                            })}
                                            className={`w-full ${errors.pw_check ? "border-red-500" : ""} `}
                                        />
                                    </div>
                                    {errors.pw_check && <p className="absolute left-[30%] top-full mt-1 text-red-500 text-xs">{errors.pw_check.message}</p>}
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading} aria-label="button">
                            <div hidden={!isLoading} className="spinner size-3"></div>
                            {isLoginType ? "로그인" : "회원가입"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
