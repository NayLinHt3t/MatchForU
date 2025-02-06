const mongoose = require('mongoose');
const ProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: 'true',
  },
  name: {
    type: String,
    required: [true, 'Please define a username'],
  },
  age: {
    type: Number,
    required: [true, 'Please define your age'],
  },
  bio: {
    type: String,
    required: [true, 'Write something about yourself'],
  },
  photo: {
    type: String,
    required: [true, 'Please upload a profile picture'],
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
