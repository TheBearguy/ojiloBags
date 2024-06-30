import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import dotenv from "dotenv";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error(`MongoDB connection Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;