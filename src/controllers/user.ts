import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { handleSignupErrors } from '../util/errors';
// import { IUser } from '../models/user';

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

export const login = async (req, res, next) => {
  const { email, password } = req.body;
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

  return res.status(201).json(user);
};

export const logout = async (req, res, next) => {
  req.session.destroy();
};