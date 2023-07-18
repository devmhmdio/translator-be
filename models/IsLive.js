const mongoose = require('mongoose');

const IsLiveSchema = new mongoose.Schema({
    isLive: {
        type: Boolean,
        required: true,
    },
    writerId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('IsLive', IsLiveSchema);