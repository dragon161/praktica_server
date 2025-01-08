const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dateAdded: { type: Date, default: Date.now },
  images: [{ type: String }],
});

module.exports = mongoose.model('Achievement', achievementSchema);