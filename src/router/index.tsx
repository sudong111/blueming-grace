import { Routes, Route } from 'react-router-dom'

import { Home } from '@/pages/home'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import { InvestmentDiaryAdd } from '@/pages/investmentDiaryAdd'
import { InvestmentDiaryDetail } from '@/pages/investmentDiaryDetail'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/investment/add" element={<InvestmentDiaryAdd />} />
            <Route path="/investment/:id" element={<InvestmentDiaryDetail />} />
        </Routes>
    )
}