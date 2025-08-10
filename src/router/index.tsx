import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Signup from '../pages/Signup'
import Login from '../pages/Login'
import InvestmentDiaryAdd from '../pages/InvestmentDiaryAdd'
import InvestmentDiaryDetail from '../pages/InvestmentDiaryDetail'

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