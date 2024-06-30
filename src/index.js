import { app } from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/index.js";
import { DB_NAME } from "./constants.js";
dotenv.config(
    {
        path: './.env'
    }
);

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.error(`Error: ${error.message}`);
        throw error
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error(`Error: ${error.message}`);
})