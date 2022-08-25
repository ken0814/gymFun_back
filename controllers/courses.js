import courses from '../models/courses.js'

export const createCourse = async (req, res) => {
  try {
    const result = await courses.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file?.path || '',
      sell: req.body.sell,
      category: req.body.category,
      time: req.body.time,
      place: req.body.place,
      coach: req.user._id,
      profile: req.user.profile[0].document
    })
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

export const editCourse = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      place: req.body.place,
      sell: req.body.sell,
      category: req.body.category,
      time: req.body.time
    }
    if (req.file) data.image = req.file.path
    const result = await courses.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deleteCourse = async (req, res) => {
  try {
    const idx = req.user.courses.findIndex(item => item.course.toString() === req.params.id)
    if (idx > -1) {
      req.user.courses.splice(idx, 1)
      await req.user.save()
    } else return res.status(400).send({ success: true, message: '找不到' })
    await courses.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
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
    const result = await courses.find({ sell: true }).populate('profile')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllCourses = async (req, res) => {
  try {
    const result = await courses.find().populate('coach')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}