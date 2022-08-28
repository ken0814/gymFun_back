import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import courses from '../models/courses.js'

export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllCoachs = async (req, res) => {
  try {
    const result = await users.find({ role: 1 }).populate('profile.document')
    const final = []
    for (const idx in result) {
      if (result[idx].profile.length === 0) continue
      else if (result[idx].profile[0].document.sell === false) continue
      else final.push(result[idx])
    }
    res.status(200).send({ success: true, message: '', final })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllStudents = async (req, res) => {
  try {
    const result = await users.find({ role: 0 }).populate('profile.document')
    const final = []
    for (const idx in result) {
      if (result[idx].profile.length === 0) continue
      else if (result[idx].profile[0].document.sell === false) continue
      else final.push(result[idx])
    }
    res.status(200).send({ success: true, message: '', final })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await users.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '刪除成功', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// export const addCart = async (req, res) => {
//   try {
//     const result = await courses.findById(req.body.course)
//     if (!result || !result.sell) {
//       return res.status(400).send({ success: false, message: '課程不存在' })
//     }
//     const idx = req.user.cart.findIndex(item => item.course.toString() === req.body.course)
//     if (idx > -1) {
//       req.user.cart[idx].status = req.body.status
//     } else {
//       req.user.cart.push({
//         course: req.body.course,
//         status: req.body.status
//       })
//     }
//     await req.user.save()
//     res.status(200).send({ success: true, message: '', result: req.user.cart.length })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const key = Object.keys(error.errors)[0]
//       const message = error.errors[key].message
//       return res.status(400).send({ success: false, message })
//     } else {
//       res.status(500).send({ success: false, message: '伺服器錯誤' })
//     }
//   }
// }

// export const editCart = async (req, res) => {
//   try {
//     if (req.body.status !== true) {
//       await users.findOneAndUpdate(
//         { _id: req.user._id, 'cart.course': req.body.course },
//         {
//           $pull: {
//             cart: { course: req.body.course }
//           }
//         }
//       )
//     } else {
//       await users.findOneAndUpdate(
//         { _id: req.user._id, 'cart.course': req.body.course },
//         {
//           $set: {
//             'cart.$status': req.body.status
//           }
//         }
//       )
//     }
//     res.status(200).send({ success: true, message: '' })
//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       const key = Object.keys(error.errors)[0]
//       const message = error.errors[key].message
//       return res.status(400).send({ success: false, message })
//     } else {
//       res.status(500).send({ success: false, message: '伺服器錯誤' })
//     }
//   }
// }

// export const getCart = async (req, res) => {
//   try {
//     const result = await users.findById(req.user._id, 'cart').populate('cart.course')
//     res.status(200).send({ success: true, message: '', result })
//   } catch (error) {
//     res.status(500).send({ success: false, message: '伺服器錯誤' })
//   }
// }

export const addCourse = async (req, res) => {
  try {
    const result = await courses.findById(req.body.course)
    if (!result) {
      return res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
    const idx = req.user.courses.findIndex(item => item.course.toString() === req.body.course)
    if (idx > -1) {
      req.user.save()
    } else {
      req.user.courses.push({
        course: req.body.course
      })
      req.user.save()
    }
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCourses = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'courses').populate('courses.course')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}