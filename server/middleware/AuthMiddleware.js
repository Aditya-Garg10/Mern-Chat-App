import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) =>{
    const token = req.cookies.jwt;
    // console.log(req.cookies)
    // console.log({token})
    if(!token) return res.status(401).json("You are not Authorized!");
    jwt.verify(token,process.env.JWT_KEY,async(err,payload)=>{    
        if(err) return res.status(403).json("Token is not Valid!");
         req.UserId = payload.UserId ;           
        next();

    })
}