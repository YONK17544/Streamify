import express from 'express';
import { LogIn, LogOut, SignUp } from '../controllers/auth.controllers.js';

const router = express.Router();

//Sign Up, Log In, Log Out routes
router.post('/signup', SignUp);

router.post('/login', LogIn);

router.post('/logout', LogOut);

export default router;