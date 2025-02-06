const express = require('express');
const dontenv = require('dotenv');
const dbConnect = require('./dbConnect');
const AppError = require('./utils/appError');
dontenv.config();
const globalErrorHandler = require('./controllers/error');
const userRoutes = require('./routes/user');
const app = express();
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use('*', globalErrorHandler);

const db = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.PASSWORD);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(db);
    app.listen(PORT, () => {
      console.log(`Listening in port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
