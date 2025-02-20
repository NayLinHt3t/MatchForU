const express = require('express');
const dontenv = require('dotenv');
const dbConnect = require('./dbConnect');
const AppError = require('./utils/appError');
const fileUpload = require('express-fileupload');
const http = require('http');
const cloudinary = require('cloudinary').v2;
dontenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const { initialzieSocket } = require('./socket');

const globalErrorHandler = require('./controllers/error');
const userRoutes = require('./routes/user');
const matchRoutes = require('./routes/match');
const messageRoutes = require('./routes/message');
const activityRoutes = require('./routes/activity');
const app = express();
const httpServer = http.createServer(app);

initialzieSocket(httpServer);
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use('/api/v1/users', userRoutes, matchRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/activity', activityRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use('*', globalErrorHandler);

const db = process.env.DATABASE.replace('<DB_PASSWORD>', process.env.PASSWORD);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await dbConnect(db);
    httpServer.listen(PORT, () => {
      console.log(`Listening in port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
