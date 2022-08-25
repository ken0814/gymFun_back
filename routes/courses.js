import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import coach from '../middleware/coach.js'
import upload from '../middleware/upload.js'
import {
  createCourse,
  editCourse,
  deleteCourse,
  getCourses,
  getAllCourses
} from '../controllers/courses.js'

const router = express.Router()
// 創立課程
router.post('/', content('multipart/form-data'), auth.jwt, upload, createCourse)
// 修改課程
router.patch('/:id', content('multipart/form-data'), auth.jwt, upload, editCourse)
// 刪除課程
router.delete('/:id', auth.jwt, deleteCourse)
// get所有課程
router.get('/all', auth.jwt, admin, getAllCourses)
// get上架課程
router.get('/', getCourses)



export default router
