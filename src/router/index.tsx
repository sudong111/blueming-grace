import { Routes, Route } from 'react-router-dom'

import Home from '../pages/home.tsx'
import Signup from '../pages/signup.tsx'
import Login from '../pages/login.tsx'
import InvestmentDiaryAdd from '../pages/investmentDiaryAdd.tsx'
import InvestmentDiaryDetail from '../pages/investmentDiaryDetail.tsx'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/investment/add" element={<InvestmentDiaryAdd />} />
            <Route path="/investment/:id" element={<InvestmentDiaryDetail />} />
        </Routes>
    )
}