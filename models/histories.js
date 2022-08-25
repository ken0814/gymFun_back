import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  course: {
    type: mongoose.ObjectId,
    ref: 'courses'
  },
  status: {
    type: Number,
    default: 0
  },
  studentDocument: {
    type: mongoose.ObjectId,
    ref: 'profiles'
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, { version: false })

export default mongoose.model('histories', schema)
