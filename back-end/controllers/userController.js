import validator from 'validator'
import bcrypt, { genSalt } from 'bcrypt'
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctor.model.js'
import appointmentModel from '../models/appointment.model.js'
import razorpay from 'razorpay'

// API to register user 
const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body
        if(!name || !password || !email){
            return res.json({success:false,message:'Missing details'})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:'Enter a valid email'})
        }

        if(password.length < 8){
            return  res.json({success:false,message:'password length must be atleast 8'})
        } 
        
        const salt  = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userdata = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userdata)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success:true , token})
        

    } catch (error) {
        console.log("Error in registring the user", error);
        res.json({success:false,message:error.message})
    }
}


// API for user login 

const userLogin = async (req,res)=>{
    try {
        const {email,password} = req.body

        const user = await userModel.findOne({email})
        
        if(!user){
            return  res.json({success:false,message:'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid credential"})
        }
    } catch (error) {
        console.log("Error in user login", error);
        res.json({success:false,message:error.message})
    }
}


// API to get user profile data 


const getProfile = async (req,res)=>{
    try {
        const { userId }= req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})
    } catch (error) {
        console.log("Error in loading user data", error);
        res.json({success:false,message:error.message})
    }
}

// API to update profile 
const updateProfile = async (req,res)=>{
    try {
        const {userId, name, phone, address,dob, gender} = req.body
        const imageFile = req.file
        if(!name || !phone || !address|| !dob || !gender){
            return res.json({success:false,message:"Data Missing"})
        }
      
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUpload.secure_url
           
            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
        }

        res.json({success:true,message:"Profile Updated"})
    } catch (error) {
        console.log("error in updating profile",error);
        res.json({success:false,message:error.message})
    }
}


// API to book appointment 

const bookAppointment = async (req,res)=>{
    try {
        const {userId, docId,slotDate,slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')
        if(!docData.available){
            return res.json({success:false,message:"Doctor is not Available"})
        }
    let slots_booked = docData.slots_booked
    // checking for slot availabilty 
    if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false,message:'Slot not avilable'})
        }
        else{
            slots_booked[slotDate].push(slotTime)
        }
    }
    else{
        slots_booked[slotDate] =[]
        slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    // delete docData.slots_booked

    const appointmentData = {
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now()
    }
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:"Appointment Booked"})

    } catch (error) {
        console.log("error in appointment booking",error);
        res.json({success:false,message:error.message})
    }
}

// API to get user appointment for frontend 

const listAppointment = async(req,res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})
    } catch (error) {
        console.log("error in listing user appointment",error);
        res.json({success:false,message:error.message})
    }
}

// API to cancel appointment 
const cancelAppointment = async (req,res)=>{
    try {
        const {userId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appoinment user 
        if(appointmentData.userId !== userId){
            return res.json({success:true,message:'Unauthorized action'})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        // releasing doctor slot 
        const {docId,slotDate,slotTime}= appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=> e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment Cancelled'})

    } catch (error) {
        console.log("error in deleting user appointment",error);
        res.json({success:false,message:error.message})
    }
}
// const razorpayInstance = new razorpay({
//     key_id : process.env.RAZORPAY_KEY_ID,
//     key_secret : process.env.RAZORPAY_KEY_SECRET
// })

// // API to make payment of appointment using razorpay 
// const paymentRazorpay = async (req,res)=>{
//     const {appointmentId} = req.body
//     const appointmentData = await appointmentModel.findById(appointmentId)

//     if(!appointmentData || appointmentData.cancelled){
//         return res.json({success:false,message:"Appointment Cancelled or not found"})
//     }

//     // creating optins for razorpay 
//     const options= {
//         amount :appointmentData.amount *100,
//         currency: 'INR',
//         receipt :appointmentId
//     }

//     const order  = await razorpayInstance.orders.create(options)

//     res.json({success:true,order})
// }

// API to verify razorpay payment 
//  const verifyRazorpay = async (req,res)=>{
//     try {
//         const {razorpay_order_id} = req.body
//         const orderInfo = await razorpayInstace.orders.fetch(razorpay_order_id)

//         // console.log(orderInfo)/
//         if(orderInfo.status ==='paid'){
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
//             res.json({success:true,message:"Payment Succesful"})
//         }
//         else
//         {
//             res.json({success:false,message:"Payment Failed"})
//         }
//     } catch (error) {
//         console.log("error in payment",error);
//         res.json({success:false,message:error.message})
//     }
//  }
export {registerUser,
    userLogin,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    // paymentRazorpay,
    // verifyRazorpay

}