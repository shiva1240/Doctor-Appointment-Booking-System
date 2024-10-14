import express from 'express'

import { addDoctor,adminDashboard,allDoctors,appointmentAdmin,appointmentCancel,loginAdmin } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';


const router = express.Router();

router.post('/add-doctor',authAdmin ,upload.single('image'),addDoctor)
router.post('/login',loginAdmin)
router.post('/all-doctors',authAdmin,allDoctors)
router.post('/change-availabilty',authAdmin,changeAvailability)
router.get('/appointments',authAdmin,appointmentAdmin)
router.post('/cancel-appointment',authAdmin,appointmentCancel)
router.get('/dashboard',authAdmin,adminDashboard)
export default router