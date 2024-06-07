import express from 'express';
import { test, updateUser, deleteUser, signout } from '../controllers/user.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';

const router = express.Router();
router.get('/test', test);
router.put('/update/:userId', verifyUserToken, updateUser);
router.delete('/delete/:userId', verifyUserToken, deleteUser);
router.post('/signout', signout);

export default router;