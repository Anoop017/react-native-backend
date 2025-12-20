import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {QuizAttempt} from '../models/QuizAttempt.js'


const router = express.Router()

//Start - YAY

router.post('/start', authMiddleware, async (req,res)=>{
    try {
        const userId = (req as any).user.id
        const {keyword,totalQuestions,wrongAnswers, percentage} = req.body

        if(!keyword || !totalQuestions){
            return res.status(400).json({error:"Keyword is required"})
        }
        const newAttempt = await QuizAttempt.create({
            userId,
            keyword,
            totalQuestions,
            wrongAnswers,
            percentage,
            startedAt :new Date(),
            status:'in_progress',

        })

        res.status(200).json(
            {message:"Quiz Started",
                attemptId:newAttempt._id
        })

    } catch (error) {
        res.status(500).json({error:String(error)})
    }
});

router.post('/submit', authMiddleware, async (req, res)=>{
    try{
        const userId = (req as any).user.id;
        const {attemptId, correctAnswers} = req.body;

        if(!attemptId || correctAnswers === undefined) {
            return res.status(400).json({error: "AttemptId and correctAnswers are required"})

        }

        const attempt = await QuizAttempt.findById(attemptId);

        if(!attempt){
            return res.status(401).json({message:"Not Authorised"})
        }

        if(attempt.userId.toString() !== userId){
            return res.status(401).json({message:"Unauthorised to Submit this"})
        }

        if(attempt.status === "submitted"){
            return res.status(400).json({message:"Quiz already submited"})
        }
        attempt.correctAnswers = correctAnswers;
        attempt.status = "submitted"
        attempt.endedAt = new Date()

        attempt.timeSpent = (attempt.endedAt.getTime() - attempt.startedAt.getTime())/1000

        let totalQuestions = attempt.totalQuestions;
        let wrongAnswers = attempt.totalQuestions - attempt.correctAnswers
        let percentage = (correctAnswers/totalQuestions) * 100

        await attempt.save()

        return res.status(200).json({
            message:"Quiz completed succesfully",
            Score : correctAnswers,
            total:totalQuestions,
            Wrong:wrongAnswers,
            percentage:percentage.toFixed(2),
            durationSeconds:attempt.timeSpent
        })
        

    }catch(error){
        res.status(500).json({error:String(error)})
    }
})


export default router;