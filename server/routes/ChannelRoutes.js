import {Router} from 'express'
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { createChannel, getChannelMessages, getUserChannels } from '../controllers/ChannelController.js';

const channelRoutes = Router();

channelRoutes.post("/createChannel", verifyToken, createChannel )
channelRoutes.get("/getUserChannels", verifyToken, getUserChannels )
channelRoutes.get("/getChannelMessage/:channelId", verifyToken, getChannelMessages )

export default channelRoutes;