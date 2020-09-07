const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/user');

/* POST add a new user to the DB */
router.post('/signup', signup);

/* POST login user */
router.post('/login', login);

/* POST log user out */
router.post('/logout', logout);

module.exports = router;
