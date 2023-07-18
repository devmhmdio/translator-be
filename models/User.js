const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ['writer', 'admin', 'glossary_writer'],
    required: true,
    default: 'writer',
  },
  its: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
