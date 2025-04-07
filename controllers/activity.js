const catchAsync = require('../utils/catchAsync');
const Activity = require('../models/activity');
const AppError = require('../utils/appError');
exports.createActivity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { activityName, time, location, number } = req.body;
  const newActivity = await Activity.create({
    userId,
    activityName,
    time,
    location,
    number,
  });
  res.status(201).json({
    status: 'success',
    data: {
      newActivity,
    },
  });
});
exports.getAllActivity = catchAsync(async (req, res, next) => {
  const activities = await Activity.find({});
  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
});

exports.joinActivity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { activityId } = req.params;
  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }
  if (activity.participants.includes(userId)) {
    return next(new AppError('You have already joined this activity', 400));
  }
  activity.participants.push(userId);
  await activity.save();
  res.status(200).json({
    status: 'success',
    data: {
      activity,
    },
  });
});

exports.getActivity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { activityId } = req.params;
  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }
  if (!activity.participants.includes(userId)) {
    return next(new AppError('You have not joined this activity', 400));
  }
  const numberOfParticipants = activity.participants.length;
  res.status(200).json({
    status: 'success',
    data: {
      activity,
      numberOfParticipants,
    },
  });
});
