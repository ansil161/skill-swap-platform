import Register from './auth/register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'

function App(){
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<Register/>}/>
  </Routes>
  </BrowserRouter>
}
