const mongoose = require('mongoose');

const dbConnect = (db) => {
  return mongoose.connect(db);
};
module.exports = dbConnect;
