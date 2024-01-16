import mongoose from 'mongoose'

const MONGO_URL = 'mongodb+srv://bekbolkochkorov:CxFTxDuo2EksCypo@cluster0.g3n4l3d.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready')
})

mongoose.connection.on('error', err => {
    console.log('MongoDB error:', err)
})

export async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}

export async function mongoDisconnect() {
    await mongoose.disconnect()
}

// module.exports = {
//     mongoConnect,
//     mongoDisconnect
// }