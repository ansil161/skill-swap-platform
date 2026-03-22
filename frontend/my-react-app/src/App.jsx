import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from './user/authe/Login'
import Home from './user/pages/Home'
import Match from './user/pages/match'
import ProfilePage from './user/pages/Profil'
import Requests from './user/pages/request'
import Navbar from './user/component/navbar'
import Dashboard from './user/pages/dashboard'
import Hai from './user/pages/new'
import ForgotPassword from './user/authe/forgot'
import ResetPassword from './user/authe/resetpassword'
import Chat from './user/component/chatlist'
import SessionList from './user/pages/sessionlist'
import SessionScheduler from './user/pages/sessionfrom'
import VideoCallPage from './user/pages/videohome'

function App(){
    const conversationId = 2;
  const userId = 1;
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
          <Route path='/nav' element={<Navbar/>}/>
          <Route path='/dash' element={<Dashboard/>}/>
            <Route path='/hai' element={<Hai/>}/>
             <Route path='/forgote' element={<ForgotPassword/>}/>
       
            <Route path="/reset-password/:uid/:token" element={<ResetPassword/>} />
       <Route path='/chat' element={<Chat/>}/>
       <Route path="/sessions" element={<SessionList />} />
        <Route path="/schedule/:swapRequestId" element={<SessionScheduler />} />
         <Route path="/video/:roomId" element={<VideoCallPage />} />
             
             
            

      


  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App