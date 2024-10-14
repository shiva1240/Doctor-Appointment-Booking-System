import React, { useContext, useEffect, useState } from 'react'
import {assets} from '../assets/assets.js'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate();
    const [state,setState] = useState('Admin')
    const{aToken,setAtoken,backendUrl} = useContext(AdminContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {dToken,setDToken} = useContext(DoctorContext)
    const onSubmitHandler = async(event)=>{
            event.preventDefault()  // when submit the form it will not reload the webpage

            try {
                if(state === 'Admin')
                {
                    const {data}  = await axios.post(backendUrl + '/api/admin/login',{email,password})
                    if(data.success){
                        localStorage.setItem('aToken',data.token)
                        setAtoken(data.token)
                    }
                    else
                    {
                        toast.error(data.message)
                    }

                }
                else{
                        const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
                        if(data.success){
                            localStorage.setItem('dToken',data.token)
                            setDToken(data.token)
                            // console.log(data.token);
                            
                        }
                        else
                        {
                            toast.error(data.message)
                        }
                    
                    }
            } catch (error) {
                
            }

    }
    
  return (
    <form onSubmit={onSubmitHandler}  className='min-h-[80vh] flex items-center'>
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg '>
            <p className='text-2xl font-semibold m-auto'>
                <span className='text-primary'>{state}</span> Login
            </p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required/>
            </div>
            <div className='w-full'>
                <p>password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required/>
            </div>
            <button onClick={()=>{aToken || dToken ? navigate('/'):navigate()}} className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
            {
                state === 'Admin'
                ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>click here</span></p>
                : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>click here</span></p>

            }
        </div>
    </form>
  )
}

export default Login