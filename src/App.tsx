import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import Header from "./components/header.tsx";
import './global.css'

export default  function App() {
  return (
    <div className="view">
        <BrowserRouter>
            <Header />
            <Router />
        </BrowserRouter>
    </div>
  )
}