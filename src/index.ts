// src/index.ts
import express from 'express';
import  connectDB  from './db.js';
import mongoose from 'mongoose'
import {User} from './models/Users.js'
import authRouter from './routes/auth.js'
import authMiddleware from './middleware/auth.js';

const app = express();
app.use(express.json());


app.use('/auth',authRouter)


// from middleware...................
app.get('/me',authMiddleware,(req,res)=>{
  const user = (req as any).user; 
  res.json({user});
})


app.get('/db-check', async (_req, res) => {
  try {
    const state = mongoose.connection.readyState; 
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const db = mongoose.connection.db;
    const collections = db ? await db.listCollections().toArray() : [];
    res.json({ connectedState: state, collections: collections.map(c => c.name) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});


app.post('/test-create-user', async (req,  res)=>{
  try {
    const user = await User.create({
      email:'test@example.com',
      password:'123456'
    })

    res.json({message:'User Created', user})
  } catch (error) {
    res.status(500).json({error:String(error)})
  }
})


app.get('/', (req,res)=>{
    res.send("Connected")
})


const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
};

start();
