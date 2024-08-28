import React from 'react'
import Chatheader from './components/Chatheader'
import Messagebar from './components/Messagebar'
import MessageContainer from './components/MessageContainer'

const ChatContainer = () => {
  
  return (
    <div className='absolute top-0 h-[100vh] w-[100vw] bg-[#121212] flex flex-col md:static md:flex-1' >
      <Chatheader/>
      <MessageContainer/>
      <Messagebar/>
    </div>
  )
}

export default ChatContainer
