const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  waaz: {
    type: Number,
    required: true,
  },
  hijriDate: {
    type: String,
    required: true,
  },
  englishDate: {
    type: Date,
    required: true,
  },
  writers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
