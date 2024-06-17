import express from 'express'
import { verifyUserToken } from '../utils/verifyUser.js';
import { create } from '../controllers/post.controller.js';
import { getposts } from '../controllers/post.controller.js';
import { deletepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUserToken, create);
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyUserToken, deletepost);

export default router;