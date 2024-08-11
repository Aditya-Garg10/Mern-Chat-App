import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {  HOST } from '@/utils/constants'
import { getColor } from '@/lib/utils'







const ContactList = ({ contacts, isChannel = false }) => {
  const { selectedChatData, setSelectedChatData, setSelectedChatType, selectedChatType, setSelectedChatMessages } = useAppStore()

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel")
      setSelectedChatData(contact)
      
    }
    else {
      setSelectedChatType("contact")
      setSelectedChatData(contact)
      if (selectedChatData && selectedChatData._id !== contact._id) {
        setSelectedChatMessages([])
        
      }
    }
  }

  

  useEffect(() => {
    console.log("contacts",contacts);

  }, [])
  return (
    <div className='mt-5'>
      {
        contacts.map((contact) => {

          return <div key={contact._id} className={`pl-8 justify-start  py-2 transition-all duration-300 flex cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-neutral-700 " : "hover:bg-[#15121211]"}`} >

          
            <div 
            onClick={() => handleClick(contact)} className="flex gap-5 items-center justify-start text-neutral-300">

              {
                !isChannel &&
                <Avatar className='h-10 w-10  rounded-full overflow-hidden '>
                  {
                    contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} alt='profile' className='object-cover w-full h-full' />) : (<div className={` ${selectedChatData && selectedChatData._id === contact._id ? ` border-white/90 border-2` : `${getColor(contact.color)}`} uppercase  h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full `}>{contact.email ? contact.email.split("").shift() : contact.email.split("").shift()}</div>)
                  }
                </Avatar>
              }
              {
                isChannel && (<div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>)
              }
              {isChannel ? (<span>{contact.name}</span>) : (<span>{`${contact.firstName} ${contact.lastName}`}</span>)}
            </div>

            






            

          </div>
        })
      }
    </div>
  )
}

export default ContactList
