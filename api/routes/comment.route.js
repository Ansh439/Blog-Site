import express from 'express'
import {verifyUserToken} from '../utils/verifyUser.js'
import { createComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUserToken, createComment);

export default router;