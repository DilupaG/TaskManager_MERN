const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Please provide company'],
      maxlength: 50,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
    },
    status: {
      type: String,
      enum: ['inCompleted', 'completed'],
      default: 'inCompleted',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', TaskSchema)
