import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import { createContext,useContext,useEffect,useRef} from 'react'
import { io } from 'socket.io-client';

const SocketContext = createContext(null)

export const useSocket = () =>{
    return useContext(SocketContext);
}



export const SocketProvider = ({children}) =>{
    const socket = useRef();
    const {userInfo} = useAppStore()

    useEffect(()=>{
        if(userInfo){
            socket.current = io(HOST,{
                withCredentials: true,
                query: { UserId:  userInfo.id},                
            });
            socket.current.on("connect",()=>{
                console.log("Connected to socket Server");
            });

            const handlerecieveMessage = (message) =>{
                const { selectedChatData, selectedChatType, addMessage , addContactsInDmContacts } = useAppStore.getState();

                if(selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log("message recieved",message)
                    addMessage(message)
                }
                addContactsInDmContacts(message)
            }

            const handleChannelRecieveMessage = (message)=>{
                const { selectedChatData, selectedChatType, addMessage,addChannelInChannelList } = useAppStore.getState();

                if(selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    console.log("message recieved",message)
                    addMessage(message)
                }
                addChannelInChannelList(message)
            }

            socket.current.on("recieveMessage",handlerecieveMessage)
            socket.current.on("recieve-channel-message",handleChannelRecieveMessage)

            return () =>{
                socket.current.disconnect();
            }
        }
    },[userInfo])
    return(
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}