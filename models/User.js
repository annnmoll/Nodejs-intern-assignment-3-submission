const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4 },
  username: { type: String, unique: true, required: true },
  bio: String,
  profilePictureUrl: String,
  email: String,
  password: String, // Hashed password, not stored in plain text
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Follow' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

