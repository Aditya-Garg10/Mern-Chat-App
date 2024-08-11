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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://mern-chat-app-frontend-pri8.onrender.com'); // Update to match your client's domain
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow cookies to be sent
    next();
  });



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