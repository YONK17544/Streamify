import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();


//AUTH CONTROLLERS
export async function SignUp(req, res) {
    // Logic for signing up a user
    const { fullName, email, password } = req.body;
    
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       if (!emailRegex.test(email)) {
       return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({email: email});
        if(existingUser) {
            return res.status(400).json({ message: 'Email already exist. Please use a different email' });
        }

        const idx = Math.floor(Math.random()*100) + 1;//generate a random number between 1 and 100
        const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        });

        await newUser.save();
        //TODO: CREATE THE USER IN STREAM AS WELL

        //token for authentication
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});

        // Set the JWT token in a cookie
        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
        });

        res.status(201).json({success:true, user:newUser});

    } catch (error) {
        console.log('Error in SignUp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function LogIn(req, res) {
    // Logic for logging in a user
    res.send('Login successful!');
}   

export function LogOut(req, res) {
    // Logic for logging out a user
    res.send('Logout successful!');
}