import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'

import './passport/passport.js'
import usersRouter from './routes/users.js'
import coursesRouter from './routes/courses.js'
import ordersRouter from './routes/orders.js'
import advertisesRouter from './routes/advertises.js'
import historiesRouter from './routes/histories.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler (req, res, next, options) {
    res.status(429).send({ success: false, message: '太多請求' })
  }
})
app.use(limiter)

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.use(mongoSanitize())

app.use('/users', usersRouter)
app.use('/courses', coursesRouter)
app.use('/orders', ordersRouter)
app.use('/bill', advertisesRouter)
app.use('/registration', historiesRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})
