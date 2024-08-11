import React,{useState} from 'react'
import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {apiClient} from "@/lib/api-client"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'




const Auth = () => {
  const { setUserInfo ,userInfo} = useAppStore()
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");


  const handleValidate = () =>{
    if(!email.length){
      toast.error("Email is Required")
      return false;
    }  
    if(!password.length){
      toast.error("Email is Required")
      return false;
    }  
    if(password !== confirmpassword){
      toast.error("Password and Confirm Password Should be Same")
    } 
    else{

      return true;
    } 

  }

  const  handleLoginValidate = () =>{
    if(!email.length){
      toast.error("Email is Required")
      return false;
    }  
    else if(!password.length){
      toast.error("Password is Required")
      return false;
    }    
    else{

      return true;
    } 
  }
  const handleLogin = async() =>{
  try {
    
    if(handleLoginValidate()){
      const response = await apiClient.post(LOGIN_ROUTE,{email,password},
        {withCredentials : true}
      )
      console.log(response)
      if(response.status === 204){
        toast("Incorrect Credentials")        
      }
      else if(response.data.user.id){
        setUserInfo(response.data.user)
        if(response.data.user.profileSetup){
          navigate("/chat")
        }        
        else{
          navigate("/profile")
        }}
      
      
    }
  } catch (error) {
    toast.error(error.message)
  }
    

  }

  const [current, setcurrent] = useState("login");
  const handleSignup = async() =>{
    try {
      if(handleValidate()){
        const response = await apiClient.post(SIGNUP_ROUTE,{email,password},
          {withCredentials : true}
        )
        
          if(response.status===201){   
            toast.success("Please Login Using Your created Credentials to Continue")         
            // setUserInfo(response.data.user) 
            setcurrent("login")                                   
          }         
                
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data)
    }
  }
  return (
    <div>
      <div className='h-[110vh] w-[100vw] justify-center flex items-center '>
        <div className="h-[100vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl: grid-cols-1 xl:grid-cols-2">
          <div className='flex flex-col gap-10 items-center justify-center '>
            <div className='flex  items-center justify-center flex-col'>
              <div className='flex items-center justify-center '>
                <h1 className='text-4xl  font-bold md:text-4xl sm:text-xs '>Welcome</h1>
                <img src={Victory} alt="Victory Image" className='h-[100px]' />
              </div>
              <p className='font-medium  md:m-5 text-center'>Fill in the details to get Started with the best Chat App</p>
            </div>
            <div className='flex items-center justify-center w-full'> 
            <Tabs className='w-3/4' value={current} onValueChange={setcurrent} defaultValue="login"  >
              <TabsList className='bg-transparent rounded-none flex w-full'>
                <TabsTrigger value='login'
                className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>Login</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' value='signup'>Signup</TabsTrigger>
              </TabsList>
              <TabsContent value='login' className='flex flex-col gap-5 mt-10'>
                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e)=> setemail(e.target.value)}></Input>
                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e)=> setpassword(e.target.value)}></Input>                
                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent value='signup' className='flex flex-col gap-5 '>
              <Input placeholder="Email" type="email" className="rounded-full  p-6" value={email} onChange={(e)=> setemail(e.target.value)}></Input>
                <Input placeholder="Password" type="password" className="rounded-full  p-6" value={password} onChange={(e)=> setpassword(e.target.value)}></Input>
              <Input placeholder="Confirm Password" type="password" className="rounded-full  p-6" value={confirmpassword} onChange={(e)=> setconfirmpassword(e.target.value)}></Input>
              <Button className="rounded-full p-6" type="submit" onClick={handleSignup}>SignUp</Button>
              </TabsContent>
              </Tabs> 
              </div>
          </div>
          <div className='hidden xl:flex  justify-center items-center '>
            <img src={Background} className='h-[600px]' alt="" />
            </div>          
        </div>
      </div>
    </div>
  )
}

export default Auth
