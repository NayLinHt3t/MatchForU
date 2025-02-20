const catchAsync = require('../utils/catchAsync');
const Activity = require('../models/activity');
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
exports.getActivity = catchAsync(async (req, res, next) => {
  const activities = await Activity.find({});
  res.status(200).json({
    status: 'success',
    data: {
      activities,
    },
  });
});
