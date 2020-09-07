const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(
  session({
    name: 'faaid_qid',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax'
    },
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false
  })
);

app.use('/', usersRouter);

const port = 8080;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => console.log('Database connected successfully'))
  .then((r) =>
    app.listen(port, function () {
      console.log('Listening on port ' + port);
    })
  )
  .catch((err) => console.log(err));
