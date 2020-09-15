import express from 'express';
import { user, signup, login, logout } from '../controllers/user';
const router = express.Router();

/* GET user index */
router.get('/user/:id', user);

/* POST add a new user to the DB */
router.post('/signup', signup);

/* POST login user */
router.post('/login', login);

/* POST log user out */
router.post('/logout', logout);

export default router;
