const Profile = require('../models/profile');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

exports.createProfile = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: 'profile_picture' }
  );
  const image = result.secure_url;
  fs.unlinkSync(req.files.image.tempFilePath);

  const { name, age, bio } = req.body;

  if (!name || !age || !bio) {
    return next(new AppError('Please fill all fields', 400));
  }

  const userId = req.user._id;
  const existingProfile = await Profile.findOne({ userId });
  if (existingProfile) return next(new AppError('Profile already exist', 400));
  const profile = await Profile.create({
    userId: req.user._id,
    name,
    age,
    bio,
    photo: image,
  });
  res.status(201).json({
    status: 'success',
    data: {
      profile,
    },
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return next(new AppError('User Not Found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      profile,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });
  if (!profile) {
    return next(new AppError('You profile is not found', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      profile,
    },
  });
});

exports.deleteProfile = catchAsync(async (req, res, next) => {
  await Profile.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
