import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = async(req, res, next) => {
    try {


        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({ message: 'Unauthorized, no token provided' });
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY not defined in environment variables");
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized, invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');

        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;    
        next();

    } catch (error) {
        console.log('Error in protectRoute:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}