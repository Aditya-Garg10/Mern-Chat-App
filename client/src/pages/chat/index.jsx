import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ChatContainer from './components/chat-container'
import ContactsContainer from './components/contacts-conntainer'
import EmptyChatContainer from './components/empty-chat-container'

const Chat = () => {



  const { 
    userInfo,
    selectedChatType, 
    selectedChatData,
    isuploading,
    isdownloading,
    fileuploadProgress,
    fileDownloadProgress } = useAppStore()
  const navigate = useNavigate()

  useEffect(()=>{
    if(userInfo.profileSetup === false){
      toast("Please setup your Profile First");
      navigate("/profile");
    }
    else{
      
    }
    
    
  },[userInfo])

  
  return (
    <div className='flex res bg-[#1c1d25] h-[100vh] text-white overflow-hidden'>
      {
        isuploading && (<div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
          <h5 className='text-5xl animate-pulse'>Uploading Files</h5>
          {fileuploadProgress}%
        </div>)
      }

      {
        isdownloading && (<div className='h-[100vh] w-[100vw]  fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
          <h5 className='text-5xl animate-pulse'>Downloading Files</h5>
          {fileDownloadProgress}%
        </div>)
      }
      <div className='h-full ls'> <ContactsContainer/></div>
      
      
        
     { selectedChatType === undefined ? ( <EmptyChatContainer/> ): (<ChatContainer/>)}
      
      
      
      
    </div>
  )
}

export default Chat
