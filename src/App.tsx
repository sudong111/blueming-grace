import { BrowserRouter} from 'react-router-dom'
import Router from './router'
import './global.css'
import Header from "./pages/Header";

export default  function App() {
  return (
    <div className="view">
        <Header />
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    </div>
  )
}