import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import {  animationDeefaultOptions , getColor } from '@/lib/utils'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { SEARCH_CONTACTS_ROUTE } from '@/utils/constants'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { HOST } from '@/utils/constants'
import { useAppStore } from '@/store'



const Newdm = () => {
  const {setSelectedChatType , setSelectedChatData } = useAppStore()
  const [openNewContactModel, setopenNewContactModel] = useState(false);
  const [searchContacts, setsearchContacts] = useState([]);

  const searchContact = async (searchTerm) => {
    try {
      if (searchTerm) {
        const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { searchTerm }, { withCredentials: true, headers : {
          "Access-Control-Allow-Origin": '*'
        }, });
        
        if (response.status === 200 && response.data.contacts) {
          setsearchContacts(response.data.contacts)
        }
      }
      else {
        setsearchContacts([])
      }
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  const SelectNewContact = (contact) =>{
    setopenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact)
    setsearchContacts([])
  }
  return (
    <>
      <div>
        <TooltipProvider>
          <Tooltip >
            <TooltipTrigger><FaPlus onClick={() => setopenNewContactModel(true)} className='text-neutral-400 font-light text-opacity-90 text-small hover:text-neutral-100 cursor-pointer transition-all duration-300' /></TooltipTrigger>            
            <TooltipContent className='bg-[#1c1b1e] text-white border-none p-3'>
              <p>Select New Contact here</p>
            </TooltipContent>
          </Tooltip>
          
        </TooltipProvider>
        <Dialog open={openNewContactModel} onOpenChange={setopenNewContactModel}>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
            <DialogHeader>
              <DialogTitle>Please select a contact</DialogTitle>
              <DialogDescription>

              </DialogDescription>
            </DialogHeader>
            <div>
              <Input placeholder="Search Contacts" onChange={(e) => searchContact(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>
            {
              searchContact.length > 0 && (
                <ScrollArea className="h-[250px] ">
                <div className="flex flex-col gap-5">
                  {searchContacts.map(contact => (<div key={contact._id} className='flex gap-3 items-center cursor-pointer ' onClick={()=>SelectNewContact(contact)}>
                  <div className="flex gap-2 items-center justify-center ">
                  <div className='w-12 h-12 relative' >
                      <Avatar className='h-12 w-12  rounded-full overflow-hidden '>
                          {
                              contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} alt='profile' className='object-cover w-full h-full' /> : <div className={`uppercase  h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>{contact.email ? contact.email.split("").shift() : contact.email.split("").shift()}</div>
                          }           
                      </Avatar>
                  </div>
                  <div className="flex flex-col" >
                  <span>{
                    
                    contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : ""
                
                }</span>
                <span className='text-xs'>{contact.email}</span>
                  </div>
                 
                
              </div>
                  </div>)
                  )}
                  
                </div>
              </ScrollArea>
              )
            }
           
            {
              searchContacts.length <= 0 && (<div>
                <div className='flex-1 p-5 md:bg-[#1c1d25] md:flex flex-col  justify-center items-center  duration-1000 transition-all'>
                  <Lottie ClickToPauseDisabled={true} height={140} width={200} options={animationDeefaultOptions} />
                  <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center"></div>
                  <h3 className='poppins-medium gap-2'>
                    Search  a New
                    <span className='text-purple-500'> Contact. </span> 
                  </h3>
                </div>
              </div>
           ) }           
          </DialogContent>
        </Dialog>


      </div>

    </>
  )
}

export default Newdm
