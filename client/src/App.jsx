import React, { useEffect ,useState} from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from '@/store'
import { apiClient } from '@/lib/api-client'
import { GET_USER_INFO } from './utils/constants'




const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const  isAuthenticated  = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}


const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const  isAuthenticated  = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {
    
    const { userInfo , setUserInfo} = useAppStore()
    const [loading, setloading] = useState(true);
    
  useEffect(()=>{
    const getUserData = async() =>{
      try {
        const response = await apiClient.get(GET_USER_INFO,{                 
          headers:{
            "jwt" : localStorage.getItem("jwt")
          }
        })
        if(response.status===200 && response.data.user.id){
          setUserInfo(response.data.user)
        } else{
          setUserInfo(undefined)
        }                
      } catch (error) {
        setUserInfo(undefined)
      }
      finally{
        setloading(false)
      }
    }
    if(!userInfo){
      getUserData()
    }   
    else{
      setloading(false)
    }   
  },[userInfo,setUserInfo])

  
        
  if(loading){
    return <div>Loading....</div>
  }

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <AuthRoute>
              <Auth />
            </AuthRoute>            
          }></Route>
          <Route path='/chat' element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>}>            
          </Route>
          <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>}>
          </Route>
          <Route path='*' element={<Navigate to="/" />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
