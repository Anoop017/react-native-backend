import type {RequestHandler} from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const authMiddleware:RequestHandler = (req, res, next)=>{
    const authHeader = req.headers.authorization || ""

    const token = authHeader.startsWith("Bearer ")?authHeader.slice(7):null

    if(!token){
        return res.status(401).json({message:"No tokens provided"})
    }

    if(!JWT_SECRET){
        return res.status(500).json({message:"Server Configuration Error"})
    }


    try{
        const decoded = jwt.verify(token, JWT_SECRET) as  {userId:string, email:string}

        (req as any).user = {
            id:decoded.userId,
            email:decoded.email
        }
        next();

    }catch(error){
        res.status(401).json({error:"Invalid or expired token"})
    }
}



export default authMiddleware;