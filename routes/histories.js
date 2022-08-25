import express from 'express'
import * as auth from '../middleware/auth.js'
import student from '../middleware/student.js'
import content from '../middleware/content.js'
import {
  createHistory
} from '../controllers/histories.js'

const router = express.Router()

// history
router.post('/', content('application/json'), auth.jwt, student, createHistory)

export default router
