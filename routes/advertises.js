import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createAdvertise,
  getAllAdvertises,
  deleteAdvertise,
  editAdvertise
} from '../controllers/advertises.js'

const router = express.Router()

// 建立廣告
router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createAdvertise)
// 修改廣告
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editAdvertise)
// get廣告
router.get('/all', getAllAdvertises)
// 刪除廣告
router.delete('/:id', auth.jwt, admin, deleteAdvertise)

export default router
