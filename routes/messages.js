import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import {
  createMessages,
  deleteMessage,
  getMessage
} from '../controllers/messages.js'

const router = express.Router()

router.post('/:id', content('application/json'), auth.jwt, createMessages)
router.get('/', auth.jwt, getMessage)
router.delete('/:id', auth.jwt, deleteMessage)

export default router