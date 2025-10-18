import mongoose from "mongoose";
import "dotenv/config";

export const connectdb = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error){
        console.log("Error connecting to mongdb", error);
        process.exit(1);
    }
}