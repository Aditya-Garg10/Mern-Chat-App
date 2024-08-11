import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import router from './routes/AuthRouter.js'
import contactsRoutes from './routes/ContactsRoutes.js'
import setupSocket from './socket.js'
import messageRoute from './routes/MessageRoutes.js'
import channelRoutes from './routes/ChannelRoutes.js'

dotenv.config();

const app = express()
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","DELETE","PUT","PATCH"],
    credentials: true,
}))



const port = process.env.PORT
const database = process.env.DATABASE_URL

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))
app.use(cookieParser());
app.use(express.json());


mongoose.connect(database).then(()=>console.log("MongoDB connected"))

app.get("/",(req,res)=>{
    res.send("Helloi")
})

app.use("/api/auth",router);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messageRoute);
app.use("/api/channels",channelRoutes);


const server = app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

setupSocket(server)