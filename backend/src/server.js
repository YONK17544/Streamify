import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

//USING AUTH ROUTE
app.use("/api/auth", authRoutes);

//USING USERS ROUTE
app.use("/api/users", userRoutes);

//USING CHAT ROUTE
app.use("/api/chat", chatRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDB().then(() => {
        console.log('Database connected successfully');
    }).catch((error) => {
        console.error('Database connection failed:', error);
    });
})