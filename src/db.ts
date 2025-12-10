import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/first-backend-for-react-native-app'

const connectDB = async () =>{
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Conencted succesfully to MongoDB")

  }catch(error){
    console.error("Error in connection", error )
    process.exit (1)
  }
}

export default connectDB
