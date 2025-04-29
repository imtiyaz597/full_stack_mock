const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Student', 'Management'],
    default: 'Student' // Student is default if not provided
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
