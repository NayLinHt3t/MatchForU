const User = require('../models/user');
const Profile = require('../models/profile');
const Match = require('../models/match');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getConnectedUsers, getIO } = require('../socket');
exports.likeUser = catchAsync(async (req, res, next) => {
  const { likedUserId } = req.body;
  const currentUserId = req.user._id;
  const checkUser = await User.findOne({ _id: likedUserId });
  if (checkUser._id.equals(currentUserId)) {
    return next(new AppError("You can't like yourself", 400));
  }
  let match = await Match.findOne({
    $or: [
      { user1: currentUserId, user2: likedUserId },
      { user1: likedUserId, user2: currentUserId },
    ],
  });
  if (!match) {
    match = await Match.create({
      user1: currentUserId,
      user2: likedUserId,
      user1Action: 'like',
    });
  } else {
    if (match.user2.equals(likedUserId) && match.user1Action === 'like') {
      return next(new AppError('Already Liked the user', 400));
    } else if (
      match.user2.equals(currentUserId) &&
      match.user1Action === 'like'
    ) {
      match.user2Action = 'like';
      match.status = 'matched';
      match.matchedAt = new Date();
      const connectedUsers = getConnectedUsers();
      const io = getIO();
      const likedUserSocketId = connectedUsers.get(likedUserId);

      const likedUserProfile = await Profile.findOne({ userId: likedUserId });
      const currentUserProfile = await Profile.findOne({
        userId: currentUserId,
      });
      if (likedUserSocketId) {
        io.to(likedUserSocketId).emit('newMatch', {
          _id: currentUserId,
          name: currentUserProfile.name,
          image: currentUserProfile.photo,
        });
      }
      const currentUserSocketId = connectedUsers.get(currentUserId);
      if (currentUserSocketId) {
        io.to(likedUserSocketId).emit('newMatch', {
          _id: currentUserId,
          name: likedUserProfile.name,
          image: likedUserProfile.photo,
        });
      }
    } else {
      match.status = 'reject';
    }
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
  const checkUser = await User.findOne({ _id: rejectedUserId });

  if (checkUser._id.equals(currentUserId)) {
    return next(new AppError("You can't reject yourself", 400));
  }
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
  });
  const matchedProfile = await Promise.all(
    matches.map(async (match) => {
      const profile = await Profile.findOne({ userId: currentUserId });
      return profile;
    })
  );

  res.status(200).json({ matchedProfile });
});
