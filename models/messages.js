import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, '缺少訊息']
  },
  user: {
    type: mongoose.ObjectId
  }
}, { version: false })

export default mongoose.model('messages', schema)
