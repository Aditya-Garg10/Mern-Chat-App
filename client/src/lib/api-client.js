import axios from 'axios'
import { HOST } from '@/utils/constants'


export const apiClient = axios.create({
    headers :{
        "jwt" : localStorage.getItem("jwt"),
        "Access-Control-Allow-Origin": '*',   
    },
    baseURL : HOST,    
})