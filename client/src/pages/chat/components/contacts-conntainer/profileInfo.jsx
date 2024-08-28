import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip'
import { apiClient } from '@/lib/api-client'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { GET_USER_INFO, HOST, LOGOUT_ROUTE } from '@/utils/constants'
import React, { useEffect,useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import {IoLogOut, IoPowerSharp} from 'react-icons/io5'
import {Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'



const profileInfo = () => {
    const { userInfo,setUserInfo } = useAppStore();

    const [firstName, setfirstName] = useState("");
    const [email, setEmail] = useState("");
    
    const navigate = useNavigate()
    
    const logout = () =>{        
            localStorage.removeItem("jwt") 
            navigate("/auth") 
                              
            // const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials: true});

            // if (response.status === 200){
            //     setUserInfo(null)
            // }
       
    }
    return (
        <div className='relative bottom-0 h-16  flex items-center  justify-between p-4 w-full bg-[#121212]'>
            <div className="flex gap-2 items-center justify-center ">
                <div className='w-12 h-12 relative'>
                    <Avatar className='h-12 w-12  rounded-full overflow-hidden '>
                    
                        {
                           userInfo.user ?  <div className={`uppercase  h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}> { userInfo.user.email && userInfo.user.email.split("").shift()}</div>
                          : userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.image}`} alt='profile' className='object-cover w-full h-full' /> : <div className={`uppercase  h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}> { userInfo.email && userInfo.email.split("").shift()}</div>
                        }
                    </Avatar>
                </div>
            {
                userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
            }
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger> <FiEdit2 onClick={()=>navigate("/profile")} className='text-purple-500 text-xl font-medium' /></TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none ">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger> <a href="/auth"><IoPowerSharp onClick={logout} className='text-yellow-500 text-xl font-medium' /></a> </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none ">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default profileInfo
