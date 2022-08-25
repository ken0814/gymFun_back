import advertises from '../models/advertises.js'

export const createAdvertise = async (req, res) => {
  try {
    const result = await advertises.create({
      name: req.body.name,
      description: req.body.description,
      URL: req.body.URL,
      image: req.file?.path || ''
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getAllAdvertises = async (req, res) => {
  try {
    const result = await advertises.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteAdvertise = async (req, res) => {
  try {
    const result = await advertises.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '刪除成功', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editAdvertise = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      URL: req.body.URL
    }
    if (req.file) data.image = req.file.path
    const result = await advertises.findByIdAndUpdate(req.params.id, data, { new: true })
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
