import histories from "../models/histories.js"

export const getRegister = async (req, res) => {
  try {
    const result = await histories.find().populate('course studentDocument')
    const final = []
    for (const idx in result) {
      for (const key in req.user.courses) {
        if (result[idx].course._id.toString() === req.user.courses[key].course.toString()) {
          final.push(result[idx])
        }
      }
    }
    res.status(200).send({ success: true, message: '', final })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: true, message: '' })
  }
}
