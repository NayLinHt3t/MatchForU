const Profile = require('../models/profile');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.create({
    userId: req.user._id,
    name: req.body.name,
    age: req.body.age,
    bio: req.body.bio,
    photo: req.body.photo,
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
