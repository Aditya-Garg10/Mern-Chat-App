import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)


const messageRoute = Router();

const upload = multer({dest : path.join(__dirname,"/tmp/uploads/files/")})

messageRoute.post("/getMessages", verifyToken,getMessages )
messageRoute.post("/uploadFile", verifyToken,upload.single("file"),uploadFile )

export default messageRoute;