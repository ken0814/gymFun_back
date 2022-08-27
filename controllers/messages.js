import messages from '../models/messages.js'
import users from '../models/users.js'

export const createMessages = async (req, res) => {
  try {
    const result = await messages.create({
      content: req.body.content
    })
    console.log(req.params.id)
    const deal = await users.findById(req.params.id)
    console.log(deal)
    deal.messages.push({
      message: result._id,
      user: req.user._id
    })
    await deal.save()
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

export const getMessage = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'messages').populate('messages.message messages.user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
