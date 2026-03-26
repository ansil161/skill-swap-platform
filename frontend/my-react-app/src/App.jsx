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
import RecruiterProfile from './jobplatform/pages/recrutarprofile'
import JobsSubNavbar from './jobplatform/pages/jobsubnav'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import RoleProtectedRoute from './routes/protectedroute'
import Unauthorized from './routes/unauthorised'
import MyApplications from './jobplatform/pages/myapplylist'

function App(){

  return(
    <>
      <BrowserRouter>
      <ChatButton/>
  <Routes>  
        <Route path='/' element={<Home/>}/>
    <Route path='/register' element={<Register/>}/>
    <Route path='/login' element={<Login/>}/>
<Route path='/profile' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
    <ProfilePage/>
  </RoleProtectedRoute>
} />
      <Route path='/match' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
    <Match/>
  </RoleProtectedRoute>
} />
       <Route path='/request' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
    <Requests/>
  </RoleProtectedRoute>
} />
       
                    
          <Route path='/nav' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
   <Navbar/>
  </RoleProtectedRoute>
} />
          
          <Route path='/dash' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
    <Dashboard/>
  </RoleProtectedRoute>
} />
         
            <Route path='/hai' element={<Hai/>}/>
             <Route path='/forgote' element={<ForgotPassword/>}/>
       
            <Route path="/reset-password/:uid/:token" element={<ResetPassword/>} />

                    <Route path='/chat' element={
  <RoleProtectedRoute allowedRoles={["user"]}>
   <Chat/>
  </RoleProtectedRoute>
} />  
                    <Route path="/sessions" element={
  <RoleProtectedRoute allowedRoles={["user"]}>
   <SessionList />
  </RoleProtectedRoute>
} />  
                           <Route path="/schedule/:swapRequestId" element={
  <RoleProtectedRoute allowedRoles={["user"]}>
   <SessionScheduler />
  </RoleProtectedRoute>
} />  
      
                                  <Route path="/video/:roomId"  element={
  <RoleProtectedRoute allowedRoles={["user"]}>
 <VideoCallPage />
  </RoleProtectedRoute>
} /> 
         
             
             
            
<Route path="/admin" element={
  <RoleProtectedRoute allowedRoles={["admin"]}>
    <AdminLayout><Dashboardad /></AdminLayout>
  </RoleProtectedRoute>
} />
<Route path="/admin/users" element={
  <RoleProtectedRoute allowedRoles={["admin"]}>
    <AdminLayout><Users /></AdminLayout>
  </RoleProtectedRoute>
} />
<Route path="/admin/swaps" element={
  <RoleProtectedRoute allowedRoles={["admin"]}>
    <AdminLayout><Swaps /></AdminLayout>
  </RoleProtectedRoute>
} />
        <Route path="/admin/sessions" element={<AdminLayout><Sessions /></AdminLayout>} />

      
      <Route path="/jobs" element={<JobList />} />
<Route path="/jobs/:id" element={<JobDetail />} />
<Route path="/jobs/:id/apply" element={<ApplyJob />} />
<Route path="/create-job" element={
  <RoleProtectedRoute allowedRoles={["recruiter"]}>
    <CreateJob />
  </RoleProtectedRoute>
} />
<Route path="/my-jobs" element={
  <RoleProtectedRoute allowedRoles={["recruiter"]}>
    <MyJobs />
  </RoleProtectedRoute>
} />
<Route path="/jobs/:id/applicants" element={<Applicants />} />
<Route path="/dashrec" element={
  <RoleProtectedRoute allowedRoles={["recruiter"]}>
    <RecruiterDashboard />
  </RoleProtectedRoute>
} />
<Route path="/recriterprofile" element={
  <RoleProtectedRoute allowedRoles={["recruiter"]}>
    <RecruiterProfile />
  </RoleProtectedRoute>
} />

<Route path="/myapplylist" element={
  <RoleProtectedRoute allowedRoles={["user"]}>
    <MyApplications/>
  </RoleProtectedRoute>
} />
<Route path="/jobusernav" element={<JobsSubNavbar />} />
<Route path="/unauth" element={<Unauthorized />} />



  </Routes>
   <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
    />
  </BrowserRouter>
    </>
  )

}

export default App