import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN, 
        credentials: true
    }
));
app.use(express.json(
    {
        limit: '50kb'
    }
));
app.use(cookieParser());
app.use(express.urlencoded(
    { 
        extended: true, 
        limit: '50kb' 
    }
));
app.use(express.static('public'))

// http://localhost:8000/api/v1/users

// app.use('/api/v1/users', require('./routes/userRoutes'));

export {
    app
}