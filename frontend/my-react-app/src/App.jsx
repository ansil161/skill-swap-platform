import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from './user/authe/Login'
import Home from './user/pages/Home'
import ProfilePage from './user/pages/profil'

function App(){
  return(
    <>
      <BrowserRouter>
  <Routes>
        <Route path='/' element={<Home/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>

  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App