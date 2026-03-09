import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from './user/authe/Login'
import Home from './user/pages/Home'

function App(){
  return(
    <>
      <BrowserRouter>
  <Routes>
    <Route path='/registe' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<Home/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App