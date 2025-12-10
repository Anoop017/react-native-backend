import mongoose from 'mongoose'

export interface IUser {
    email: string,
    password: string,
    // timeStamps:any
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true

        },
        password: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)


export const User = mongoose.model<IUser>('User',UserSchema)

