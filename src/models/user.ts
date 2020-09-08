import mongoose from 'mongoose';
import { isEmail } from 'validator';

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  stocks?: [string];
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required']
  },
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password']
  },
  stocks: {
    type: [String],
    required: false
  }
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;
