import { animationDeefaultOptions } from '@/lib/utils'
import React from 'react'
import Lottie from 'react-lottie'

const EmptyChatContainer = () => {
  
  return (
    <div className='flex-1 md:bg-[#121212] md:flex flex-col  justify-center items-center  duration-1000 transition-all'>
     <Lottie ClickToPauseDisabled={true} height={400} width={400} options={animationDeefaultOptions}/>
     <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center"></div>
     <h3 className='poppins-medium text-center gap-2'>
      Hi  <span className='text-purple-500'>!</span> Welcome to 
      <span className='text-purple-500'> QuickText </span> Chat App <span className='text-purple-500'>.</span>
     </h3>
    </div>
  )
}

export default EmptyChatContainer
