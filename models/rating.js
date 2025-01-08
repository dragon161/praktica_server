const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);