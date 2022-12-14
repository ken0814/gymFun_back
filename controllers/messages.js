import messages from '../models/messages.js'
import users from '../models/users.js'

export const createMessages = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).send({ success: true, message: '不能傳訊息給自己' })
    else {
      const result = await messages.create({
        content: req.body.content
      })
      const deal = await users.findById(req.params.id)
      deal.messages.push({
        message: result._id,
        sender: req.user._id,
        senderProfile: req.user.profile[0].document
      })
      await deal.save()
      res.status(200).send({ success: true, message: '', result })
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

export const getMessage = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'messages').populate('messages.message messages.sender messages.senderProfile')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const result = await messages.findByIdAndDelete(req.params.id)
    for (const idx in req.user.messages) {
      if (req.user.messages[idx].message.toString() === req.params.id) req.user.messages.splice(idx, 1)
    }
    req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
