const mongoose = require('mongoose');
const fs = require('fs');
const AppError = require('../utils/appError');
const { type } = require('os');
const cloudinary = require('cloudinary').v2;
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
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'prefer not to say'],
      message: 'please choose your gender',
    },
    required: [true, 'please choose your gender'],
  },
  interest: {
    type: String,
    enum: {
      values: ['male', 'female', 'both'],
      message: 'please choose your interest',
    },
    required: [true, 'please choose your gender in interest'],
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
