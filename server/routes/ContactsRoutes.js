import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getAllContacts, getContactsDMList, searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search",verifyToken,searchContacts);
contactsRoutes.get("/getContactsForDM",verifyToken,getContactsDMList);
contactsRoutes.get("/getAllContacts",verifyToken,getAllContacts);


export default contactsRoutes;