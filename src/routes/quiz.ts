import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {QuizAttempt} from '../models/QuizAttempt.js'


const router = express.Router()

//Start - YAY

router.post('/start', authMiddleware, async (req,res)=>{
    try {
        const userId = (req as any).user.id
        const {keyword} = req.body

        if(!keyword){
            return res.status(400).json({error:"Keyword is required"})
        }
        const newAttempt = await QuizAttempt.create({
            userId,
            keyword,
            startedAt :new Date(),
            status:'in_progress',

        })

        res.status(200).json({message:"Quiz Started"})

    } catch (error) {
        res.status(500).json({error:String(error)})
    }
});


export default router;