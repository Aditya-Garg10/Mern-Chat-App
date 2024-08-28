import { useAppStore } from '@/store'
import React,{useEffect, useRef, useState} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {IoArrowBack} from 'react-icons/io5'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { getColor } from '@/lib/utils'
import { colors } from '@/lib/utils'
import {FaTrash, FaPlus} from "react-icons/fa"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants'

const Profile = () => {
  

  const navigate = useNavigate()
  const {userInfo,setUserInfo} = useAppStore()
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setimage] = useState(null);
  const [hover, sethover] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const [generate, setgenerate] = useState(true);
  const fileInnputRef = useRef(null)
  

  
  
  useEffect(()=>{
    if(userInfo.profileSetup){
      setfirstName(userInfo.firstName)
      setlastName(userInfo.lastName)
      setselectedColor(userInfo.color)          
    }
    else{
      toast("Please Setup Profile")
    }
    
    if(userInfo.image){
      setimage(`${HOST}/${userInfo.image}`)            
    }
    else{
      toast("Please Setup Profile")
    }

    
},[userInfo])



  const validateProfile = ()  =>{
    if(!firstName && !lastName){
      toast.error("First Name and Last Name is Required")
      return false
    }
    else{
      return true
    }
  }

  const saveChanges = async (e) =>{
    
    if(validateProfile()){
      try {
        const response =  await apiClient.post(UPDATE_PROFILE_ROUTE,{UserId: userInfo.id,firstName,lastName,color : selectedColor},{withCredentials:true
          ,headers:{
            "jwt" : localStorage.getItem("jwt")
          }
        });
        if(response.status === 200 && response.data)                
        setUserInfo({...response.data})   
          toast.success("Profile Updated Successfully")
          navigate("/chat")                           
        } 
         catch (error) {
          console.log(error)
        toast(error.message)
      }
                          
    }

  }

  const handleNavigate = () =>{
    if(userInfo.profileSetup){
      navigate("/chat");
    }
    else{
      navigate("/profile")
      toast.error("Please Setup Your Profile")
    }
  }

  const handlefileInputClick = () =>{
    fileInnputRef.current.click()
  }

  const handleImageChange = async(event)=>{
    const file = event.target.files[0];    
    
    if(file){
      const formData = new FormData();
      formData.append("profile-image",file);
      formData.append("UserId",userInfo.id)
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials: true, headers : {
        "Access-Control-Allow-Origin": '*'
      },})
      if(response.status === 200 && response.data.image){
        
        setUserInfo({...userInfo,image: response.data.image})
        toast.success("Image Uploaded Successfully")
      }
     
    }
  }

  const handleDeleteImage = async(event)=>{
      try {
        const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{
          data: {UserId: userInfo.id},
          withCredentials: true,    
          headers : {
            "Access-Control-Allow-Origin": '*'
          },      
        },);
        if(response.status === 200){
          setUserInfo({...userInfo,image: null});
          toast.success("Image Removed Successfully")
          setimage(null)
        }
      } catch (error) {
        toast.error(error.message)
      }
  }


  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max"> 
      <div onClick={handleNavigate}>
        <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer'/>
      </div>
      <div className='grid grid-cols-2'>
        <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center" onMouseEnter={()=>sethover(true)} onMouseLeave={()=>sethover(false)}>
        <Avatar className='h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden '>
          {
            image ? <AvatarImage src={image} alt='profile' className='object-cover w-full h-full' />: <div className={`uppercase  h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>{firstName? firstName.split("").shift() : firstName.split("").shift()}</div>
          }
        </Avatar>
        {
          hover && <div className='absolute  inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer' 
          onClick={image? handleDeleteImage : handlefileInputClick}>
            {
            image? <FaTrash className='text-white text-3xl cursor-pointer '/> : <FaPlus className='text-white text-3xl cursor-pointer '/>
          }
          </div>
        }
        <input type="file" name='profile-image' ref={fileInnputRef} className='hidden' onChange={handleImageChange}/>
        </div>
        <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
          <div className="w-full " >
            <Input placeholder="Email" type="email"  disabled  value={userInfo.email} className="rounded-large  p-6 bg-[#2c2e3b] border-none"/>            
          </div>
          <div className="w-full " >
            <Input placeholder="First Name" type="text" value={firstName} onChange={e=>setfirstName(e.target.value)} className="rounded-large  p-6 bg-[#2c2e3b] border-none"/>            
          </div>
          <div className="w-full " >
            <Input placeholder="Last Name" type="text"    value={lastName} onChange={e=>setlastName(e.target.value)} className="rounded-large  p-6 bg-[#2c2e3b] border-none"/>            
          </div>
          <div className="w-full flex gap-5">
            {
              colors.map((color,i)=> <div className={`${color} h-8 w-8 rounded-full  cursor-pointer transition-all duration-300 ${selectedColor === i ?"outline outline-white/80":"" }`} key={i} onClick={()=>setselectedColor(i)}></div>)
              
            }
          </div>
        </div>
      </div>
      <div className="w-full">
        <Button className="h-16 w-full bg-purple-700 hover:bg-white/50 transition-all duration-300"  type="submit" onClick={saveChanges}><a>Save Changes</a></Button>
      </div>
      </div>
      
    </div>
  )
}

export default Profile
