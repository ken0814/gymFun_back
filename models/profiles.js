import mongoose from "mongoose"

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'uers'
  },
  image: {
    type: String,
    required: [true, '缺少大頭貼欄位']
  },
  name: {
    type: String,
    required: [true, '缺少姓名']
  },
  phone: {
    type: String,
    required: [true, '缺少連絡電話']
  },
  place: {
    type: [],
    required: [true, '缺少地區']
  },
  contentOfCourses: {
    type: [],
    required: [true, '缺少教學內容']
  },
  findCourse: {
    type: [],
    required: [true, '缺少找尋課程']
  },
  time: {
    type: String,
    required: [true, '缺少時間欄位'],
    enum: {
      values: ['06:00 ~ 12:00', '12:00 ~ 18:00', '18:00 ~ 00:00', '00:00 ~ 06:00']
    }
  },
  introduction: {
    type: String
  },
  sell: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('profiles', schema)