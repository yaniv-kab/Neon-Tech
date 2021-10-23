import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile, getAllUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js'
const router = express.Router()
import { protect, admin } from '../middleware/authMiddleward.js'

router.route('/').post(registerUser).get(protect, admin, getAllUsers)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)

export default router