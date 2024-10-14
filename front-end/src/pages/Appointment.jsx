import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  
  const{docId} = useParams();
  const{ doctors,currencySymbol,backendUrl,getDoctorsData,token } = useContext(AppContext);
  const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED','THU','FRI','SAT'];

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');


  const fetchDocInfo = async () =>{
    const docInfo = await doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const getAvailableSlots = async () =>{
    setDocSlots([])

    let today = new Date()

    for(let i = 0;  i<7; i++)
    {
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i)

      // setting end date 
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      // setting setHours 
      if(today.getDate() === currDate.getDate()){
        currDate.setHours(currDate.getHours() > 10 ? currDate.getHours() +1 : 10)
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0)
      }
      else{
        currDate.setHours(10);
        currDate.setMinutes(0)
      }
      let timeSlots = []
      while(currDate < endTime){
        let formatedTime = currDate.toLocaleTimeString([],{hour :'2-digit',minute: '2-digit'})
        
        let day = currDate.getDate()
        let month = currDate.getMonth()
        let year = currDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formatedTime
        
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if(isSlotAvailable){
            // add slot to Array 
        timeSlots.push({
          datetime : new Date(currDate),
          time : formatedTime
        })
      
        }
      
        currDate.setMinutes(currDate.getMinutes() + 30)
      }
      setDocSlots(prev => ([...prev, timeSlots]))
    }
}
    const bookAppointment = async ()=>{
      if(!token){
        toast.warn("Login to Book")
        return navigate('/login')
      }
      try {
        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() +1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        // console.log(slotDate);

        const {data} = await axios.post(backendUrl + '/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
        if(data.success){
          toast.success(data.message)
          getDoctorsData()
          navigate('/my-appointment')
        }else{
          toast.error(data.message)
        }
      
      } catch (error) {
        console.log("error in booking appointment",error);
        toast.error(error.message)
      }
    }



  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId]);

  useEffect(() =>{
    getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])


  return docInfo && (
    <div>
        {/* doctors details 
         */}

         <div className='flex felx-col sm:flex-row gap-4'>
          <div>
            <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'> 
            {/* Doc info with name degree and experienc  */}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /> </p>
          <div className='flex flex-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>
          </div>

          {/* doctor about  */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <div>
            <p className='text-gray-500 font-medium mt-4'>Appintment fee : <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
          </div>
          </div>
         </div>

         {/* booking slots  */}
         <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking slots</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length  && docSlots.map((item,index) =>(
                <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                    <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4' >
            {docSlots.length && docSlots[slotIndex].map((item,index) =>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white ': 'text-gray-400 border border-x-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
         </div>
         {/* listing related doctors  */}
         <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment