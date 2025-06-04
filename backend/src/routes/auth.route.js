import express from 'express';
import { LogIn, LogOut, onBoard, SignUp } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth..middleware.js';

const router = express.Router();

//Sign Up, Log In, Log Out routes
router.post('/signup', SignUp);

router.post('/login', LogIn);

router.post('/logout', LogOut);

//WE HAVE USED AUTH MIDDLEWARE TO PROTECT THE ONBOARDING ROUTE
router.post('/onboarding', protectRoute, onBoard);

//Route to get the current user's information to checl authentication status
// This route is protected by the protectRoute middleware
router.get('/me', protectRoute, (req, res) => {
    res.status(200).json({ success:true, user: req.user });
});

export default router;