import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, '缺少訊息']
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, { version: false })

export default mongoose.model('messages', schema)
