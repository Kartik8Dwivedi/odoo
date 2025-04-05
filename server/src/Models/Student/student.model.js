import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  totalTimeSpent: {
    type: Number, 
    default: 0,
  },
  badges: {
    type: [String], 
    default: [],
  },
  subject: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      learning_capabilities: {
        type: Number,
        default: 0.5,
      },
    },
  ],
  progress: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      unit: String,
      topic: String,
      subtopic: String,
      completionStatus: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number, 
      },
      lastStudied: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', studentSchema);

export default User;
