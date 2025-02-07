const mongoose = require('mongoose');

const MatchSchema = mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'reject'],
    default: 'pending',
  },
  user1Action: {
    type: String,
    enum: ['like', 'reject'],
    default: null,
  },
  user2Action: {
    type: String,
    enum: ['like', 'reject'],
    default: null,
  },
  matchedAt: { type: Date },
});

module.exports = mongoose.model('Match', MatchSchema);
