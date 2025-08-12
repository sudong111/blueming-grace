import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import { Header } from "./components/header.tsx";
import './global.css'

export const App = () => {
  return (
    <div className="wrapper">
        <BrowserRouter>
            <Header />
            <Router />
        </BrowserRouter>
    </div>
  )
}