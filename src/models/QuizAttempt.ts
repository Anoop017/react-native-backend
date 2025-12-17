import mongoose, {Schema, Types} from 'mongoose'

export interface IQuizAttempt {
    userId : Types.ObjectId;
    keyword:string;

    status : 'in_progress' | 'submitted' | 'abandoned'

    startedAt : Date;
    endedAt? : Date;
    timeStamp? : number; // in seconds, huh ??

    score: number;
    totalQuestions : number;
    correctAnswers : number;
    wrongAnswers:number;
    percentage : number;


}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId : {
            type: Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        keyword:{
            type: String, 
            required:true,
        },
        startedAt :{
            type:Date,
            required:true,
        },
        endedAt:{
            type:Date
        },
        timeStamp:{
            type:Number,
            default:0
        },
        score:{
            type:Number,
            default:0
        },
        totalQuestions:{
            type:Number,
            default:5
        },
        correctAnswers:{
            type:Number,
            default:0
        },
        wrongAnswers:{
            type:Number,
            default:0
        },
        percentage:{
            type:Number,
            default:0
        }
    },
    {timestamps:true}

);

export const QuizAttempt = mongoose.model<IQuizAttempt>(
    'QuizAttempt',
    QuizAttemptSchema
);