import { BrowserRouter} from 'react-router-dom'
import Router from './router'
import './global.css'
import Header from "./pages/header.tsx";

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