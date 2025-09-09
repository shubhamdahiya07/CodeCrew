import express from "express";
import {signup,login,profile,sendRequest} from '../controllers/userControllers.js'
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/profile',authMiddleware,profile);
router.post('/sendRequest',authMiddleware,sendRequest);

export default router;