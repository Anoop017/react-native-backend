import express from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import {User} from '../models/Users.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'
const SALT_ROUNDS = 10;


router.post('/signup', async (req,res)=>{
    if(!JWT_SECRET){
        return res.status(500).json({message:"Server configuration error"})
    };

    try {
        const {email, password} = req.body as {email?:string, password?:string}
        if (!email || !password){
            return res.status(400).json({error:"Email and Password is required"})
        };

        const existing = await User.findOne({email}).exec()
        if(existing) {
            return res.status(400).json({error:"Email already in use"})
        };

        const hashed = await bcrypt.hash(password, SALT_ROUNDS)
        const user = await User.create({email, password:hashed})

        const token = jwt.sign(
            {userId:user._id.toString(),email:user.email},
            JWT_SECRET,
            {expiresIn:JWT_EXPIRES_IN} as SignOptions
        )
        
            res.status(201).json({message:'User Created', user:{id:user._id, email:user.email}, token})
        
    } catch (error) {
        res.status(500).json({error:String(error)})
    }
})

router.post('/login', async (req,res)=>{
    if(!JWT_SECRET){
        return res.status(500).json({message:"Server configuration error"})
    };

    try {
        const {email, password} = req.body as {email?:string, password?:string}
        if(!email || !password){
            return res.status(401).json({message:"Email and Password is Required"})
        };

        const user = await User.findOne({email}).exec();
        if (!user){
            return res.status(401).json({message:"Email not found"})
        } ;

        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return(res.status(401).json({message:"Password not found"}))
        };

        const token = jwt.sign
        ({userId:user._id.toString(),email:user.email},
        JWT_SECRET,
        {expiresIn:JWT_EXPIRES_IN} as SignOptions
    )
        
        res.json({message:'logged In', token, user:{id:user._id, email:user.email}})
        
    } catch (error) {
        res.status(500).json({message:"Error while fetching Data", error})
    }
})

export default router;