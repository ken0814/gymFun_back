import courses from '../models/courses.js'
import histories from '../models/histories.js'
import profiles from '../models/profiles.js'
import users from '../models/users.js'

export const createHistory = async (req, res) => {
  try {
    const idx = req.user.histories.findIndex(item => item.course.toString() === req.body.course)
    if (idx === -1) {
      const result = await histories.create({
        course: req.body.course,
        studentDocument: req.user.profile[0].document,
        status: req.body.status
      })
      if (result) {
        const coach = await courses.findById(req.body.course, 'coach')
        const deal = await users.findById(coach.coach, 'profile')
        const coachDocument = deal.profile[0].document
        req.user.histories.push(
          {
            history: result._id,
            course: req.body.course,
            coachDocument: coachDocument
          }
        )
        await req.user.save()
      }
      return res.status(200).send({ success: true, message: '', result })
    } else {
      return res.status(400).send({ success: false, message: '已報名過此課程' })
    }

  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getHistory = async (req, res) => {
  try {
    const result = await histories.findById(req.params.id).populate('course')
    const coachName = await profiles.findById(result.course.profile, 'name')
    res.status(200).send({ success: true, message: '', result, coachName })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllHistory = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'histories').populate('histories.course histories.history histories.coachDocument')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editHistory = async (req, res) => {
  try {
    const data = {
      status: req.body.status
    }
    const result = await histories.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
