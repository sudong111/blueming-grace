import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import { Header } from "./components/header";
import { ToastContainer } from 'react-toastify';
import './global.css'

export const App = () => {
  return (
    <div className="wrapper">
        <ToastContainer
            position="top-center"
            autoClose={2000}
        />
        <BrowserRouter>
            <Header />
            <Router />
        </BrowserRouter>
    </div>
  )
}