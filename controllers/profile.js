import users from '../models/users.js'
import profiles from '../models/profiles.js'

export const createProfile = async (req, res) => {
  try {
    if (req.user.profile.length === 0) {
      const result = await profiles.create({
        user: req.user._id,
        image: req.file?.path || '',
        name: req.body.name,
        phone: req.body.phone,
        place: req.body.place,
        contentOfCourses: req.body.contentOfCourses,
        time: req.body.time,
        introduction: req.body.introduction,
        sell: req.body.sell,
        findCourse: req.body.findCourse
      })
      if (result) {
        req.user.profile.push({
          document: result._id.toString()
        })
        await req.user.save()
      }
      return res.status(200).send({ success: true, message: '', result })
    } else {
      return res.status(400).send({ success: true, message: '已經有資料不用再新增' })
    }
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

export const editProfile = async (req, res) => {
  try {
    const data = {
      user: req.user._id,
      name: req.body.name,
      phone: req.body.phone,
      place: req.body.place,
      contentOfCourses: req.body.contentOfCourses,
      findCourse: req.body.findCourse,
      time: req.body.time,
      introduction: req.body.introduction,
      sell: req.body.sell,
    }
    if (req.file) data.image = req.file.path
    const result = await profiles.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const getProfile = async (req, res) => {
  try {
    const result = await profiles.findById(req.user.profile[0].document)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
