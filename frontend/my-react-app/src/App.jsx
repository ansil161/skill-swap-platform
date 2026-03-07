import Register from './user/authe/Register'
import {Route,BrowserRouter,Routes} from 'react-router-dom'

function App(){
  return(
    <>
      <BrowserRouter>
  <Routes>
    <Route path='/' element={<Register/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )

}

export default App