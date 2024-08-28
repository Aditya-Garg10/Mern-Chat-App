import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE, HOST } from '@/utils/constants'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from 'react-icons/io5'

import { Avatar,AvatarFallback,AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils'


const MessageContainer = () => {
  
  const scrollRef = useRef(null)
  const { selectedChatType, selectedChatData,channels,setChannels, userInfo, selectedChatMessages, setSelectedChatMessages, setIsdownloading, setFileDownloadProgress } = useAppStore()


  const [showImage, setshowImage] = useState(false);
  const [imageUrl, setimageUrl] = useState(null);



  useEffect(() => {


   

    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id}, { withCredentials: true, headers : {
          "Access-Control-Allow-Origin": '*',
          "jwt" : localStorage.getItem("jwt"),
        }, })
        console.log(response)
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const getChannelMessages = async() =>{
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,{withCredentials:true, headers : {
          "Access-Control-Allow-Origin": '*',
          "jwt" : localStorage.getItem("jwt"),
        },})
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }



    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages()
      }
      else if(selectedChatType === "channel"){
        getChannelMessages()
      }
    }

   
    
      
    

  }, [setSelectedChatMessages,selectedChatType,selectedChatData])

  

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({behavior: "smooth"})
      
    }
    
  },[selectedChatMessages])
 

  const downloadFile = async (url) => {
    setIsdownloading(true)
    setFileDownloadProgress(0)
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent
        const percentCompleted = Math.round((loaded * 100) / total)
        setFileDownloadProgress(percentCompleted);
      }
    })
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a");
    link.href = urlBlob
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link)
    link.click();
    link.remove()
    window.URL.revokeObjectURL(urlBlob);
    setIsdownloading(false)
    setFileDownloadProgress(0);
  }

  const renderedMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, i) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={i}>
          {showDate && (<div className='text-center text-gray-500 my-2 '>{moment(message.timestamp).format("LL")}</div>)}

          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      )
    })
  }

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heif)$/i;
    return imageRegex.test(filePath)
  }

  const renderDMMessages = (message) => {
    
    return (
      <div className={`${message.sender !== selectedChatData._id ? "text-right" : "text-left"}`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender !== selectedChatData._id ?
              "bg-[#8417ff]/60 text-white border-[#8417ff]/50" :
              "bg-[#282b33]/60 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}> {message.content}
            </div>
          )
        }
        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id ?
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
              "bg-[#282b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
              {checkIfImage(message.fileUrl) ?
                <div className='cursor-pointer' onClick={() => {
                  setshowImage(true);
                  setimageUrl(message.fileUrl)
                }}> <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" /> </div>
                : <div className='flex items-center justify-center gap-5'><span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 '><MdFolderZip /></span> <span>{message.fileUrl.split('/').pop()}</span > <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={() => downloadFile(message.fileUrl)}><IoMdArrowRoundDown /></span> </div>}
            </div>
          )
        }
        <div className='text-xs text-gray-600 '>{moment(message.timestamp).format("LT")}</div>
      </div>
    )
  }



  const renderChannelMessages = (message) => {
    return (
      message ? ( <div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender._id === userInfo.id ?
            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
            "bg-[#282b33]/5 text-white/80 border-white/20"} border inline-block w-fit p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )
      }
      {
        message.messageType === "file" && (
          <div className={`${message.sender_id === userInfo.id ?
            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
            "bg-[#282b33]/5 text-white/80 border-white/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {checkIfImage(message.fileUrl) ?
              <div className='cursor-pointer' onClick={() => {
                setshowImage(true);
                setimageUrl(message.fileUrl)
              }}> <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" /> </div>
              : <div className='flex items-center justify-center gap-5'><span className='text-white/80 text-3xl bg-black/20 rounded-full p-3 '><MdFolderZip /></span> <span>{message.fileUrl.split('/').pop()}</span > <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={() => downloadFile(message.fileUrl)}><IoMdArrowRoundDown /></span> </div>}
              
          </div>
        )
      }
      {
        message.sender._id !== userInfo.id && message.email 
        
        ? ( <div className='text-xs flex flex-col  text-white/60 mt-0' >{moment(message.timestamp).format("LT")}
        
          </div>):
          ( <div className='flex flex-col  ms-2'>            
            {/* <Avatar className='h-8 w-8  rounded-full overflow-hidden '>
            {
              message.sender.image && (<AvatarImage src={`${HOST}/${message.sender.image}`} alt='profile' className='object-cover w-full h-full' />)}
             <AvatarFallback className={`uppercase  h-8 w-8  text-lg  flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}>{message.sender.email.split("").shift()}</AvatarFallback>
            
          </Avatar> */}
          <span className='text-sm  text-white/60'>{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          <span className='text-xs text-white/60 '>{moment(message.timestamp).format("LT")}</span>
          </div>)
      }
    </div>) : (<div>Loading</div>)
     
    )

  }
  
  
  return (
    <div  className='flex-1 overflow-y-auto  scrollbar-hidden p-4 px-8 max-h-[80vh] md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
      
      {renderedMessages()}
      <div ref={ scrollRef} />
      {
        showImage && <div className='fixed  z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col '>
          <div className='mt-7'>
            <img src={`${HOST}/${imageUrl}`} className='h-[80vh] w-full bg-cover ' alt="" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-3 ">
            <button onClick={() => downloadFile(imageUrl)} className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>
              <IoMdArrowRoundDown />
            </button>
            <button onClick={() => {
              setshowImage(false);
              setimageUrl(none);
            }
            } className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'>

              <IoCloseSharp /> 
            </button>
          </div>
        </div>
      }
      
    </div>
  )
}

export default MessageContainer
