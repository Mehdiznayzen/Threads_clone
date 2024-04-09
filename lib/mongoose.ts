import mongoose from 'mongoose'

let isConnected = false; // variable to check the connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found.')
    if(isConnected) return console.log('Already connected to MongoDB')

    try {
        await mongoose.connect(process.env.MONGODB_URL);
    
        isConnected = true; // Set the connection status to true
        console.log("MongoDB connected");
    } catch (error) {
        console.log('not connected.')
        console.log(error);
    }
}