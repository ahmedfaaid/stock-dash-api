import express from 'express';
import { signup, login, logout } from '../controllers/user';
const router = express.Router();

/* GET user index */
router.get('/', (req, res) => {
  res.send('Users');
});

/* POST add a new user to the DB */
router.post('/signup', signup);

/* POST login user */
router.post('/login', login);

/* POST log user out */
router.post('/logout', logout);

export default router;
