import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { handleSignupErrors } from '../util/errors';

/* Find user */
export const user = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!req.session.user) {
      res
        .status(401)
        .json({ error: 'You are not authorized to access this resource' });
    }

    const verify = await jwt.verify(req.session.user.token, process.env.SECRET);

    if (!verify) {
      res
        .status(401)
        .json({ error: 'You are not authorized to access this resource' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);

    res.status(400).json({ error: 'There was an error' });
  }
};

/* Sign user up */
export const signup = async (req, res) => {
  const { firstName, lastName, email, password, verifyPassword } = req.body;

  try {
    if (password !== verifyPassword) {
      res.status(403).send('Your passwords do not match');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const token = await jwt.sign({ user: newUser._id }, process.env.SECRET, {
      expiresIn: '30days'
    });
    console.log(token);

    req.session.user = { id: newUser._id, token };

    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);

    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
  }
};

/* Log user in */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(403).send('Your passwords do not match');
    }

    const token = await jwt.sign({ user: user._id }, process.env.SECRET, {
      expiresIn: '30days'
    });
    console.log(token);

    req.session.user = { id: user._id, token };

    console.log(req.session);

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'There was an error logging in' });
  }
};

/* Log user out */
export const logout = async (req, res, next) => {
  req.session.destroy();
};
