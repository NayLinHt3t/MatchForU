const User = require('../models/user');
const Profile = require('../models/profile');
const Match = require('../models/match');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.likeUser = catchAsync(async (req, res, next) => {
  const { likedUserId } = req.body;
  const currentUserId = req.user._id;
  let match = await Match.findOne({
    $or: [
      { user1: currentUserId, user2: likedUserId },
      { user1: likedUserId, user2: likedUserId },
    ],
  });
  if (!match) {
    match = await Match.create({
      user1: currentUserId,
      user2: likedUserId,
      user1Action: 'like',
    });
  } else {
    if (match.user1.equals(currentUserId)) {
      match.user1Action = 'like';
    } else {
      match.user2Action = 'like';
    }
  }
  if (match.user1Action === 'like' && match.user2Action === 'like') {
    match.status = 'matched';
    match.matchedAt = new Date();
  }
  await match.save();
  res.status(200).json({
    status: 'success',
    data: {
      match,
    },
  });
});

exports.rejectUser = catchAsync(async (req, res, next) => {
  const { rejectedUserId } = req.body;
  const currentUserId = req.user._id;
  let match = await Match.findOne({
    $or: [
      { user1: currentUserId, user2: rejectedUserId },
      { user1: rejectedUserId, user2: currentUserId },
    ],
  });
  if (!match) {
    match = new Match({
      user1: currentUserId,
      user2: rejectedUserId,
      user1Action: 'reject',
      status: 'reject',
    });
  } else {
    if (match.user1.equals(currentUserId)) {
      match.user1Action = 'reject';
    } else {
      match.user2Action = 'reject';
    }
    match.status = 'reject';
  }
  await match.save();
  res.status(200).json({ message: 'User rejected', match });
});

exports.getMatch = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;

  const matches = await Match.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
    status: 'matched',
  }).populate('user1 user2', 'username photos');

  res.status(200).json({ matches });
});
