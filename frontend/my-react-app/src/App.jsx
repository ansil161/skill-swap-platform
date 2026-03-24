import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from './user/authe/Login'
import Home from './user/pages/Home'
import Match from './user/pages/match'
import ProfilePage from './user/pages/Profil'
import Requests from './user/pages/request'
import Navbar from './user/component/navbar'
import Dashboard from './user/pages/dashboard/dashboard'
import Hai from './user/pages/new'
import ForgotPassword from './user/authe/forgot'
import ResetPassword from './user/authe/resetpassword'
import Chat from './user/component/chatlist'
import SessionList from './user/pages/sessionlist'
import SessionScheduler from './user/pages/sessionfrom'
import VideoCallPage from './user/pages/videohome'
import ChatButton from './user/pages/chatbutton'

import AdminLayout from './adminpanel/pages/adminlayout'
import Dashboardad from './adminpanel/pages/dashboard'
import Users from './adminpanel/pages/userpage'
import Swaps from './adminpanel/pages/swappage'
import Sessions from './adminpanel/pages/sessionpage'


import JobList from './jobplatform/pages/joblist'
import JobDetail from './jobplatform/pages/jobdeatail'
import ApplyJob from './jobplatform/pages/applijob'
import CreateJob from './jobplatform/pages/createjob'
import MyJobs from './jobplatform/pages/createjob'
import Applicants from './jobplatform/pages/applicantjob'
import RecruiterDashboard from './user/pages/dashboard/recruiiterdash'
function App(){

  return(
    <>
      <BrowserRouter>
      <ChatButton/>
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
             
             
            
        <Route path="/admin" element={<AdminLayout><Dashboardad /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
        <Route path="/admin/swaps" element={<AdminLayout><Swaps /></AdminLayout>} />
        <Route path="/admin/sessions" element={<AdminLayout><Sessions /></AdminLayout>} />

      
      <Route path="/jobs" element={<JobList />} />
<Route path="/jobs/:id" element={<JobDetail />} />
<Route path="/jobs/:id/apply" element={<ApplyJob />} />
<Route path="/create-job" element={<CreateJob />} />
<Route path="/my-jobs" element={<MyJobs />} />
<Route path="/jobs/:id/applicants" element={<Applicants />} />
<Route path="/dashrec" element={<RecruiterDashboard />} />


  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App