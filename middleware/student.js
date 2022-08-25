export default (req, res, next) => {
  if (req.user.role !== 0) {
    res.status(403).send({ success: false, message: '請登入學員身分的帳號' })
  } else {
    next()
  }
}