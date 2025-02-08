const Profile = require('../models/profile');
const Match = require('../models/match');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getRandomUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.user._id;
  const currentUserProfile = await Profile.findOne({ userId: currentUserId });
  if (!currentUserProfile) {
    return next(new AppError('User not Found', 404));
  }
  const { interest } = currentUserProfile;
  const interactions = await Match.find({
    $or: [{ user1: currentUserId }, { user2: currentUserId }],
  });

  const interactedUserIds = interactions.map((match) =>
    match.user1.equals(currentUserId) ? match.user2 : match.user1
  );
  console.log(interactedUserIds);
  const randomUsers = await Profile.aggregate([
    {
      $match: {
        userId: { $ne: currentUserId, $nin: interactedUserIds }, // Exclude self & interacted users
        gender: interest, // Match gender preference
      },
    },
    { $sample: { size: 5 } }, // Randomize results, limit to 10 users
  ]);
  res.status(200).json({
    status: 'success',
    result: randomUsers.length,
    data: {
      randomUsers,
    },
  });
});
