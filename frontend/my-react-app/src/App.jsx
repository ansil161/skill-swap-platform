import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from './user/authe/Login'
import Home from './user/pages/Home'
import Match from './user/pages/match'
import ProfilePage from './user/pages/Profil'
import Requests from './user/pages/request'
import Sessionform from './user/pages/sessionfrom'
import SessionList from './user/pages/sessionlist'

function App(){
  return(
    <>
      <BrowserRouter>
  <Routes>
        <Route path='/' element={<Home/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
       <Route path='/match' element={<Match/>}/>
       <Route path='/request' element={<Requests/>}/>
        <Route path='/sessionform' element={<Sessionform/>}/>
        <Route path='/sessionlist' element={<SessionList/>}/>
      


  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App