import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '帳號必填'],
    maxlength: [20, '帳號不能超過 20 個字'],
    minlength: [4, '帳號不能少於 4 個字'],
    unique: true,
    match: [/^[a-zA-Z0-9]+$/, '帳號只能有英文和數字']
  },
  email: {
    type: String,
    required: [true, '信箱必填'],
    maxlength: [50, '信箱不能超過 50 個字'],
    minlength: [4, '信箱不能少於 4 個字'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  password: {
    type: String
  },
  tokens: {
    type: []
  },
  image: {
    type: String
  },
  histories: {
    type: [
      {
        history: {
          type: mongoose.ObjectId,
          ref: 'histories'
        },
        course: {
          type: mongoose.ObjectId,
          ref: 'courses'
        },
        coachDocument: {
          type: mongoose.ObjectId,
          ref: 'profiles'
        }
      }
    ]
  },
  courses: {
    type: [
      {
        course: {
          type: mongoose.ObjectId,
          ref: 'courses',
          required: [true, '缺少課程']
        }
      }
    ]
  },
  profile: {
    type: [
      {
        document: {
          type: mongoose.ObjectId,
          ref: 'profiles',
          required: [true, '缺少profile']
        }
      }
    ]
  },
  role: {
    type: Number,
    // 0 學員 1 教練 2 管理員
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('users', schema)
