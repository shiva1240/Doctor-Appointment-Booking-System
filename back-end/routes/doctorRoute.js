import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentDoctor, doctorDashBoard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const router = express.Router()

router.get('/list',doctorList)
router.post('/login',loginDoctor)
router.get('/appointments',authDoctor,appointmentDoctor)
router.post('/complete-appointment',authDoctor,appointmentComplete)
router.post('/cancel-appointment',authDoctor,appointmentCancel)
router.get('/dashboard',authDoctor,doctorDashBoard)
router.get('/profile',authDoctor,doctorProfile)
router.post('/update-profile',authDoctor,updateDoctorProfile)


export default router