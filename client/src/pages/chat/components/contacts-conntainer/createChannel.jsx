import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'
import { CREATE_CHANNEL_ROUTES, GET_ALL_CONTACTS_ROUTE, SEARCH_CONTACTS_ROUTE } from '@/utils/constants'
import { HOST } from '@/utils/constants'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multipleselect'



const createChannel = () => {
  const {setSelectedChatType , setSelectedChatData,addChannel,setChannels } = useAppStore()
  const [newChannelModel, setnewChannelModel] = useState(false);
  const [searchContacts, setsearchContacts] = useState([]);
  const [AllContacts, setAllContacts] = useState([]);
  const [selectedContacts, setselectedContacts] = useState([]);
  const [ChannelName, setChannelName] = useState("");


  useEffect(()=>{
    const getData = async () =>{
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE,{withCredentials:true})
        setAllContacts(response.data.contacts)
    }
    getData()
  },[])


    const createChannels = async() =>{
      try {
        if(ChannelName.length >0 && selectedContacts.length > 0){
          const response = await apiClient.post(CREATE_CHANNEL_ROUTES,{
            name: ChannelName,
            members:  selectedContacts.map((contact)=> contact.value)
          },{withCredentials: true})

          if(response.status === 200){
            setChannelName("")
            setselectedContacts("")
            setnewChannelModel(false)
            addChannel(response.data.channel)                                   
                   
          }
        }
        
      } catch (error) {
        toast.error(error.message)
      }
    }
  return (
    <>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger><FaPlus onClick={() => setnewChannelModel(true)} className='text-neutral-400 font-light text-opacity-90 text-small hover:text-neutral-100 cursor-pointer transition-all duration-300' /></TooltipTrigger>
            <TooltipContent className='bg-[#1c1b1e] text-white border-none p-3'>
              <p>Create New Channel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={newChannelModel} onOpenChange={setnewChannelModel}>
          <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
            <DialogHeader>
              <DialogTitle>Please fill up the details for New Channel</DialogTitle>
              <DialogDescription>

              </DialogDescription>
            </DialogHeader>
            <div>
              <Input placeholder="Channel Name" value={ChannelName} onChange={(e) => setChannelName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
            </div>

            <div>
                <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white" defaultOptions={AllContacts}
                placeholder="Search Contacts" 
                value={selectedContacts}
                onChange={setselectedContacts}
                emptyIndicator={
                    <p className='text-center text-lg leading-10 text-gray-600'>No results Found</p>
                }>

                </MultipleSelector>
            </div>
            <Button onClick={createChannels} className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 ">Create Channel</Button>
            
           
           
          </DialogContent>
        </Dialog>


      </div>

    </>
  )
}

export default createChannel
