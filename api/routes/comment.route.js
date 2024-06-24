import express from 'express'
import {verifyUserToken} from '../utils/verifyUser.js'
import { createComment } from '../controllers/comment.controller.js';
import {getPostComments} from '../controllers/comment.controller.js'
import { likeComment } from '../controllers/comment.controller.js';
import { editComment } from '../controllers/comment.controller.js';
import { deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUserToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyUserToken, likeComment);
router.put('/editComment/:commentId', verifyUserToken, editComment);
router.delete('/deleteComment/:commentId', verifyUserToken, deleteComment);

export default router;