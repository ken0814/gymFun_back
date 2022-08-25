import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者欄位']
  },
  courses: [
    {
      course: {
        type: mongoose.ObjectId,
        ref: 'courses',
        required: [true, '缺少課程欄位']
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
