const catchAsync = require('../utils/catchAsync');
const Message = require('../models/message');
const { getIO, getConnectedUsers } = require('../socket');
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, receiverId } = req.body;
  const newMessage = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content,
  });
  //send message in real time
  const io = getIO();
  const connectedUsers = getConnectedUsers();
  const receiverSocketId = connectedUsers.get(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', {
      message: newMessage,
    });
  }
  res.status(201).json({
    status: 'success',
    data: {
      newMessage,
    },
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  }).sort('createdAt');
  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});
