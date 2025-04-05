import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  class: {
    required: true,
    type: Integer,
  },
  age: {
    required: true,
    type: Integer,
  },
  streak: {
    type: Number,
    default: 0,
  },
  subject: [
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
        learning_capabilities: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const User = mongoose.model('User', studentSchema);

export default User;