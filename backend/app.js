require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { MONGO_URL } = require('./config');
const corsErr = require('./middlewares/corsErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { validationCreateUser, validationLogin } = require('./middlewares/validation');

const { createUsers, login } = require('./controllers/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(requestLogger); // request
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUsers);
app.use(auth);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);
app.use(helmet());
app.use(limiter);
app.use(errorLogger); // errors
app.use(corsErr); // cors
async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
    });
    console.log(`App connected ${MONGO_URL}`);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});
// подключаем роуты
connect();
