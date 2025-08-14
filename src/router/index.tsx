import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from 'react-router-dom'
import type { RootState } from "@/store";
import { Home } from '@/pages/home'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import { DiaryAdd } from '@/pages/diaryAdd'
import { DiaryDetail } from '@/pages/diaryDetail'
import {NotFound} from "@/pages/notFound";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/" element={
                    <PrivateRoute>
                        <Home/>
                    </PrivateRoute>
                }
                />
            <Route path="/diary/:id" element={
                <PrivateRoute>
                    <DiaryDetail/>
                </PrivateRoute>
            }
            />
            <Route path="/diary/add" element={
                <PrivateRoute>
                    <DiaryAdd/>
                </PrivateRoute>
            }
            />
            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}