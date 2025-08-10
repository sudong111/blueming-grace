import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Header from "./components/header.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './global.css'

export default  function App() {
  return (
    <div className="view">
        <BrowserRouter>
            <ToastContainer
                position="top-center"
                toastStyle={{ whiteSpace: "pre-line" }}
            />
            <Header />
            <Router />
        </BrowserRouter>
    </div>
  )
}