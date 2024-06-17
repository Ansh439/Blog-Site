import express from 'express'
import { verifyUserToken } from '../utils/verifyUser.js';
import { create, updatepost } from '../controllers/post.controller.js';
import { getposts } from '../controllers/post.controller.js';
import { deletepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUserToken, create);
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyUserToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyUserToken, updatepost);

export default router;