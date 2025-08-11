import { Routes, Route } from 'react-router-dom'

import { Home } from '@/pages/home'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import { DiaryAdd } from '@/pages/diaryAdd.tsx'
import { DiaryDetail } from '@/pages/diaryDetail.tsx'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/diary/add" element={<DiaryAdd />} />
            <Route path="/diary/:id" element={<DiaryDetail />} />
        </Routes>
    )
}