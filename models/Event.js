const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  waaz: {
    type: String,
    required: true,
  },
  hijriDate: {
    type: String,
    required: true,
  },
  englishDate: {
    type: String,
    required: true,
  },
  writers: [{
    type: mongoose.Schema.Types.String,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', EventSchema);
