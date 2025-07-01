import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";
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
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        });

        await newUser.save();
        
        //TODO: CREATE THE USER IN STREAM AS WELL
        try {
             await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic,
        });
        console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.error("Error creating Stream user:", error);
        }

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
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

          //token for authentication
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '30d'});

        // Set the JWT token in a cookie
        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
        });
        res.status(200).json({success:true, user});

    } catch (error) {
        console.log('Error in LogIn:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}   

export function LogOut(req, res) {
    // Logic for logging out a user
    res.clearCookie("jwt");
    res.status(200).json({ message: 'Logged out successfully' });
}

export async function onBoard(req, res){
    try {
        const userId = req.user._id;
        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({ 
                message: 'All fields are required' 
               ,missingFields: [
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learnLanguage',
                    !location && 'location',    
               ].filter(Boolean) // Filter out undefined values 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, {new: true});
        if(!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the Stream user as well
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.error("Error updating Stream user:", streamError.message);
        }

        res.status(200).json({success:true, user:updatedUser});
    } catch (error) {
        console.log('Error in onBoard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


}