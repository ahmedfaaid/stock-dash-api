import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import usersRouter from './routes/users';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000'
  })
);
app.use(
  session({
    name: 'faaid_qid',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: 'lax'
    },
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false
  })
);

app.use('/', usersRouter);

const port = 5050;

mongoose.set('debug', true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(result => console.log('Database connected successfully'))
  .then(r =>
    app.listen(port, function () {
      console.log('Listening on port ' + port);
    })
  )
  .catch(err => console.log(err));
