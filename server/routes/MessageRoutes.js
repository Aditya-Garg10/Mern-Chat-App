import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from 'multer'

const messageRoute = Router();
const upload = multer({dest:"/tmp/uploads/files/"})

messageRoute.post("/getMessages", verifyToken,getMessages )
messageRoute.post("/uploadFile", verifyToken,upload.single("file"),uploadFile )

export default messageRoute;