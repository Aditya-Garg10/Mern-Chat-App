import { Router } from "express";
import  {SignUp,Login,getUserInfo,updateProfile,addProfileImage,removeProfileImage, logOut}  from '../controllers/AuthController.js'
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const upload = multer({dest : path.join(__dirname,"/tmp/uploads/profiles")})

const router = Router();

router.post("/signup", SignUp)
router.post("/login", Login)
router.get("/user-info",verifyToken, getUserInfo)
router.post("/updateProfile",verifyToken, updateProfile)
router.post("/addProfileImage",verifyToken,upload.single("profile-image"), addProfileImage)
router.delete("/removeProfileImage",verifyToken,removeProfileImage)
router.post("/logout",logOut)


export default router;