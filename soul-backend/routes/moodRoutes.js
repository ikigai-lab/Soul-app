import express from "express";
import { logMood } from "../controllers/moodController.js";

const router = express.Router();

router.post("/checkin", logMood);

export default router;
