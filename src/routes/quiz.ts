import express from 'express'
import authMiddleware from '..middleware/auth.js'
import {QuizAttempt} from '..models/QuizAttempt.js'


const router = express.Router()

//Start - YAY

router.post('/start', authMiddleware, (req,res)=>{
    try {
        const userId = (req as any).user.id
    } catch (error) {
        
    }
})