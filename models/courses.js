import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱欄位']
  },
  coach: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  profile: {
    type: mongoose.ObjectId,
    ref: 'profiles'
  },
  price: {
    type: Number,
    min: [0, '價格格式錯誤'],
    required: [true, '缺少價格欄位']
  },
  description: {
    type: String
  },
  place: {
    type: String,
    required: [true, '缺少上課地點欄位']
  },
  image: {
    type: String
  },
  sell: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, '缺少分類欄位'],
    enum: {
      values: ['健體', '健力', '瑜珈', '有氧', '游泳'],
      message: '運動項目欄位錯誤'
    }
  },
  time: {
    type: String,
    required: [true, '缺少時間欄位'],
    enum: {
      values: ['06:00 ~ 12:00', '12:00 ~ 18:00', '18:00 ~ 00:00', '00:00 ~ 06:00'],
      message: '時間欄位錯誤'
    }
  }
}, { versionKey: false })

export default mongoose.model('courses', schema)
