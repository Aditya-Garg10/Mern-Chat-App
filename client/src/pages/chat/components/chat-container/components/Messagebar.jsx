import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef } from 'react'
import {useState} from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { toast } from 'sonner';


const Messagebar = () => {


 

  const {selectedChatType,selectedChatData, userInfo,setIsuploading, setIsfileuploadProgress} = useAppStore()
    const emojiRef = useRef()

    const fileInputref = useRef()

    const socket = useSocket()

    const handleAddEmojii = (emoji) =>{
        setMessage((msg)=> msg + emoji.emoji)
    }
    useEffect (()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target)){
                setemojiPrickerOpen(false)
            }
        }
       
        return () =>{ document.addEventListener("mousedown",handleClickOutside)}
    },[emojiRef,handleAddEmojii])

    const [emojiPrickerOpen, setemojiPrickerOpen] = useState(false);
    const [Message, setMessage] = useState(null);

    const handleSendMessage = async() =>{
      if(Message === null ){
        toast.error("Please Provide a Text First")
      }
      else{
        if(selectedChatType === "contact" && Message !== null){
          socket.emit("sendMessage",{
            sender: userInfo.id,
            content: Message,
            recipient: selectedChatData._id,
            messageType: "text",
            fileUrl: undefined,
          });
        }
        else if(selectedChatType === "channel"){
          socket.emit("send-channel-message",{
            sender: userInfo.id,
            content: Message,          
            messageType: "text",
            fileUrl: undefined,
            channelId : selectedChatData._id,
          })
        }
      }
      setMessage("")
      

      

    }

    const handleAttachmentClick = () =>{
      if(fileInputref.current){
        fileInputref.current.click();
      }
    }

    const handleAttachmentChange = async(e)=>{
      try {
        const file = e.target.files[0]
        // console.log(file)
        if(file){
          const formData = new FormData()
          formData.append("file",file);
          setIsuploading(true)
          const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true,
            onUploadProgress: data=>{
              setIsfileuploadProgress(Math.round((100*data.loaded)/data.total))
            }
          })
          if(selectedChatType === "contact"){
          if(response.status === 200 && response.data){
            setIsuploading(false)
            socket.emit("sendMessage",{
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }}
          
          else if(selectedChatType === "channel"){
            setIsuploading(false)
            socket.emit("send-channel-message",{
              sender: userInfo.id,
              content: undefined,          
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId : selectedChatData._id,
            })
          }
        
        }
         
      } catch (error) {
        setIsuploading(false)
      }
    }
  return (
    <div className='h-[10vh]  bg-[#121212] flex justify-center items-center  px-8 sm:px-3 mb-6 gap-6'>
      <div className="flex flex-1 md:flex-0  px-5 bg-[#2a2b33] rounded-md items-center  pr-5 sm:gap-2 sm:pr-1">
        <input type='text' value={Message} onChange={(e)=>setMessage(e.target.value)} className='  py-5 px-0 res2  bg-transparent rounded-md focus:border-none focus:outline-none ' placeholder='Type something...'></input>
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleAttachmentClick}> 
            <GrAttachment className='text-2xl'/>
            
        </button>
          <input type="file" className='hidden' ref={fileInputref} onChange={handleAttachmentChange} />
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 me-5 transition-all'> 
            <RiEmojiStickerLine className='text-2xl' onClick={()=>setemojiPrickerOpen(current=> !current)}/>            
        </button>

        <div className='absolute bottom-16 right-10' ref={emojiRef}>
            <EmojiPicker theme='dark' open={emojiPrickerOpen} onEmojiClick={handleAddEmojii} autoFocusSearch={false}/>
        </div>
        
      </div>
      <button onClick={handleSendMessage}  className='bg-white   rounded-md flex flex-2 items-center justify-center p-4 hover:bg-[#741bda]  focus:border-none focus:outline-none focus:text-white duration-300 transition-all'> 
      <IoSend className='text-2xl text-black'/>           
      </button>
    </div>
  )
}

export default Messagebar
