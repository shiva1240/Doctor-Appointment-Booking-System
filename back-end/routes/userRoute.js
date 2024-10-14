import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, registerUser, updateProfile, userLogin, } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'
const router = express.Router()


router.post('/register', registerUser)
router.post('/login', userLogin)
router.get('/get-profile', authUser, getProfile)
router.post('/update-profile',upload.single('image'),authUser,updateProfile)
router.post('/book-appointment',authUser,bookAppointment)
router.get('/appointments',authUser,listAppointment)
router.post('/cancel-appointments',authUser,cancelAppointment)
// router.post('/payment-razorpay',authUser,paymentRazorpay)
// router.post('/verifyrazorpay',authUser,verifyRazorpay)

export default router