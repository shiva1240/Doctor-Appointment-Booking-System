import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRoute from './routes/adminRoute.js'
import doctorRoute from './routes/doctorRoute.js'
import userRoute from './routes/userRoute.js'
// app config 
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middleware 
app.use(express.json())
app.use(cors())


// api end point 

app.use('/api/admin',adminRoute)
// localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRoute)
app.use('/api/user',userRoute)


app.get('/',(req,res)=>{
    res.send('API working')
})


app.listen(port, ()=>console.log("Server Started",port))