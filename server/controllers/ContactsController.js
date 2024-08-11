import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js"

export const searchContacts = async(req,res,next) =>{
    try {

    const {searchTerm} = req.body;
     
    if(searchTerm === undefined || searchTerm === null){
        return res.status(400).send("SearchTerm is required")
    }
    
    const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm,"i");

    const contacts = await User.find({
        $and: [{_id:{$ne: req.UserId}},
           { $or:[{firstName: regex},{lastName:regex},{email:regex}]},
        ],
    })
     return res.status(200).json({contacts});
    }
     catch (error) {
     res.json(error).status(500)
    }     
 }  


 export const getContactsDMList = async(req,res,next) =>{
    try {
        let { UserId } = req;
        UserId = new mongoose.Types.ObjectId( UserId );

        const contacts = await Message.aggregate([
            {
                $match:{
                    $or:[{sender:UserId},{recipient: UserId}],                    
                },                
            },
            {
                $sort:{timestamp:-1},
            },
            {$group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",UserId]},
                        then: "$recipient",
                        else: "$sender",
                    },
                },
                lastMessageTime:{$first: "$timestamp"},                
            }},
            {$lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as: "contactInfo",
            },
        },
        {
            $unwind:"$contactInfo",
        },
        {
            $project:{
            _id:1,
            lastMessageTime:1,
            email:"$contactInfo.email",
            firstName:"$contactInfo.firstName",
            lastName:"$contactInfo.lastName",
            image:"$contactInfo.image",
            color:"$contactInfo.color",
        },        
    },
    {
        $sort:{
            lastMessageTime : -1
        },
    }
    ]);

     return res.status(200).json({ contacts });
    }
     catch (error) {
     res.json(error).status(500)
    }     
 }  


 
export const getAllContacts = async(req,res,next) =>{
    try {

    const users = await User.find({_id:{$ne:req.UserId}},"firstName lastName _id email")
     
   
    const contacts = users.map((user)=>({
        label: user.firstName ? `${user.firstName} ${user.lastName} ` : user.email,
        value: user._id,
    }))
     return res.status(200).json({contacts});
    }
     catch (error) {
     res.json(error).status(500)
    }     
 }  

