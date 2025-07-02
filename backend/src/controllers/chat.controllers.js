import { generateStreamToken } from "../lib/stream.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user._id);

        res.status(200).json({ token });
    } catch (error) {
        console.log("Error generating stream token:", error);
        res.status(500).json({ error: "internal server error" });
    }
}


export function getStreamVideoToken(req, res) {
  try {
    const payload = {
      user_id: req.user._id,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, STREAM_API_SECRET, { algorithm: 'HS256' });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating video token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}