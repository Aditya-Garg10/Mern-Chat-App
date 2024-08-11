
import React, { useEffect } from 'react'
import Chat from "@/assets/copy.png"
import ProfileInfo from '@/pages/chat/components/contacts-conntainer/profileInfo'
import Newdm from './Newdm'
import { apiClient } from '@/lib/api-client'
import { GET_DM_CONTACTS_ROUTE, GET_USER_CHANNEL_ROUTES } from '@/utils/constants'
import { useAppStore } from '@/store'
import ContactList from '@/components/ContactList'
import CreateChannel from './createChannel'


const ContactsContainer = () => {
  
  const {setDirectMessagesContacts,directMessagesContacts , channels ,setChannels} = useAppStore()



  useEffect(()=>{

   const getContacts = async()=>{
    const response = await apiClient.get(GET_DM_CONTACTS_ROUTE,{withCredentials:true})
    if(response.data.contacts){
      setDirectMessagesContacts(response.data.contacts)
      // console.log(directMessagesContacts)
    }
   }

   const getChannels = async()=>{
    const response = await apiClient.get(GET_USER_CHANNEL_ROUTES,{withCredentials:true})
    if(response.data.channel){
      setChannels(response.data.channel)            
    }
   }

   getContacts()
   getChannels()
  },[])
  return (
    <div className=' h-[100vh]  flex flex-col justify-between overflow-y-auto scrollbar-hidden  bg-[#121212]/50 border-r-2 border-[#2f303b] w-full'>
      <div className="justify-between">
      <div className="p-6 gap-3  text-center flex">        
      <img src={Chat} className='h-10  ' alt="" />   
      <h3 className='h-20 text-3xl poppins-medium '>QuickText</h3>   
      </div>
      <div className="flex flex-col py-5 justify-between">
        <div className="flex text-xs items-center justify-between  pr-10">
          <Title text="Direct Messages"/>
          <Newdm/>
        </div>
        </div>
        <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden'>
      <ContactList contacts={directMessagesContacts} isChannel={false}/> 
      
      </div>
      
        
    
          
      <div className="my-5 flex flex-col py-5 justify-between ">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels"/>   
          <CreateChannel/>       
        </div>
        </div>
      <div className='max-h-[38vh] overflow-y-auto scrollbar-hidden' >
      <ContactList contacts={channels} isChannel={true}/>       
      </div>
      

      </div>
     
      <div className="">
       
       <ProfileInfo />
      </div>

      
        
    </div>
    
  )
}

export default ContactsContainer


const Title = ({text}) =>{
  return (
    <h6 className='uppercase tracking-widest text-neutral-400 pl-10  text-opacity-90 text-sm'>{text}</h6>
  )
}