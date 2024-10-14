import doctorModel from '../models/doctor.model.js'
import appointmentModel from '../models/appointment.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const changeAvailability = async (req,res)=>{
    try {
        const{docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
         res.json({success:true,message:'Availabilty Changed'})
    } catch (error) {
        console.log("Error in change in availability", error)
        res.json({success:false,message:error.message})
    }
}

const doctorList = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log("Error in loading doctors list", error)
        res.json({success:false,message:error.message})
    }
}

// API for doctor login 
const loginDoctor = async (req,res)=>{
    try {
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:'Invalid Credentials'})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token = jwt.sign({id:doctor._id} , process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }

    } catch (error) {
        console.log("Error in loging in doctor", error)
        res.json({success:false,message:error.message})
    }
}

// API to get doctor appointment for doctor pannel 

    const appointmentDoctor = async(req,res)=>{
        try {
            const {docId} = req.body
            const appointments = await appointmentModel.find({docId})

            res.json({success:true,appointments})
        } catch (error) {
            console.log("Error in loging doctor appointment", error)
            res.json({success:false,message:error.message})
        }
    }

    // API to mark appointment completed for doctor pannel 

    const appointmentComplete= async(req,res)=>{
        try {
            const {docId,appointmentId} = req.body

            const appointmentData = await appointmentModel.findById(appointmentId)

            if(appointmentData && appointmentData.docId === docId){
                await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted: true})
                return res.json({success:true,message:'Appointment Completed'})
            }else{
                return res.json({success:false,message:'Mark Failed'})
            }
        } catch (error) {
            console.log("Error in marking the  appointment", error)
            res.json({success:false,message:error.message})
        }
    }

    // API to cancel the appointment 
    const appointmentCancel= async(req,res)=>{
        try {
            const {docId,appointmentId} = req.body

            const appointmentData = await appointmentModel.findById(appointmentId)

            if(appointmentData && appointmentData.docId === docId){
                await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled: true})
                return res.json({success:true,message:'Appointment Cancelled'})
            }else{
                return res.json({success:false,message:'Mark Failed'})
            }
        } catch (error) {
            console.log("Error in marking the  appointment", error)
            res.json({success:false,message:error.message})
        }
    }

    // API to get dashboard data for doctor pannel 
    const doctorDashBoard = async(req,res)=>{
        try {
            const {docId} = req.body
            const appointments = await appointmentModel.find({docId})
            let earnings = 0

            appointments.map((item)=>{
                if(item.isCompleted || item.payment){
                    earnings += item.amount
                }
            })

            let patients = []
            appointments.map((item)=>{
                if(patients.includes(item.userId)){
                    patients.push(item.userId)
                }
            })

            const dashData = {
                earnings,
                appointments : appointments.length,
                patients : patients.length,
                latestAppointment : appointments.reverse().slice(0,5)
            }
            res.json({success:true,dashData})
        } catch (error) {
            console.log("Error in loading doctor dashboard data", error)
            res.json({success:false,message:error.message})
        }
    }

    // API to get doctor profile for doctor pannel 

    const doctorProfile = async(req,res)=>{
        try {
            const {docId} = req.body
            const profileData = await doctorModel.findById(docId).select('-password')

            res.json({success:true,profileData})
        } catch (error) {
            console.log("Error in loading doctor profile", error)
            res.json({success:false,message:error.message})
        }
    }

    // API to update doctor profile data from doctor pannel 

    const updateDoctorProfile = async(req,res)=>{
        try {
            const {docId, fees,address,available} = req.body
            await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
            res.json({success:true,message:'Profile Updated'})
        } catch (error) {
            console.log("Error in updating doctor profile", error)
            res.json({success:false,message:error.message})
        }
    }

export {changeAvailability,doctorList,
    loginDoctor,appointmentDoctor,
    appointmentComplete,appointmentCancel,
    doctorDashBoard ,
    doctorProfile  ,updateDoctorProfile 
}