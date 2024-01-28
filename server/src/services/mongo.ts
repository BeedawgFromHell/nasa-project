import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready')
})

mongoose.connection.on('error', err => {
    console.log('MongoDB error:', err)
})

export async function mongoConnect() {
    if(MONGO_URL) {
        await mongoose.connect(MONGO_URL)
    } else {
        throw new Error('Invalid MONGO_URL')
    }
}

export async function mongoDisconnect() {
    await mongoose.disconnect()
}
