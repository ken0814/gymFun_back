import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  getAllUsers,
  getAllCoachs,
  getAllStudents,
  deleteUser,
  addCourse,
  getCourses
} from '../controllers/users.js'
import {
  createProfile,
  getProfile,
  editProfile
} from '../controllers/profile.js'
import {
  createHistory,
  getHistory,
  getAllHistory
} from '../controllers/histories.js'
import {
  getRegister
} from '../controllers/getRegisters.js'

const router = express.Router()

// 註冊
router.post('/', content('application/json'), register)
// 登入
router.post('/login', content('application/json'), auth.login, login)
// 登出
router.delete('/logout', auth.jwt, logout)
// 簽token
router.post('/extend', auth.jwt, extend)

// router.post('/cart', content('application/json'), auth.jwt, addCart)
// router.patch('/cart', content('application/json'), auth.jwt, editCart)
// router.get('/cart', auth.jwt, getCart)
// 單獨取的會員資料
router.get('/', auth.jwt, getUser)
// 取得所有教練
router.get('/coach', getAllCoachs)
// 取得所有學生
router.get('/student', getAllStudents)
// 取得所有使用者
router.get('/all', auth.jwt, admin, getAllUsers)
// 刪除使用者
router.delete('/:id', auth.jwt, admin, deleteUser)
// coach
router.post('/course', auth.jwt, addCourse)
router.get('/courses', auth.jwt, getCourses)
router.get('/register', auth.jwt, getRegister)

// profile 增改查
router.post('/profile', content('multipart/form-data'), auth.jwt, upload, createProfile)
router.get('/profile', auth.jwt, getProfile)
router.patch('/profile/:id', content('multipart/form-data'), auth.jwt, upload, editProfile)

// history
router.post('/histories', content('application/json'), auth.jwt, createHistory)
router.get('/histories', auth.jwt, getAllHistory)
router.get('/histories/:id', auth.jwt, getHistory)

export default router
