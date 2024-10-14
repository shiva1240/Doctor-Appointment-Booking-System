import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
      <div >
            {/* left section  */}
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi consectetur sunt aliquam delectus laboriosam suscipit sapiente dolor iusto, iste iure voluptate modi maxime repudiandae eveniet doloremque velit qui! Minima veniam consequuntur cupiditate qui, quidem quis quibusdam voluptatibus corporis magni natus!</p>
        </div>
        <div>
            {/* center section  */}
            <p className='text-xl font-medium mb-5'>COMPANY</p>
           <ul className=' flex flex-col gap-2 text-gray-600'>
           <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
           </ul>
        </div>
        <div>
            {/* right section  */}
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className=' flex flex-col gap-2 text-gray-600'>
                <li>+1-212-456-7890</li>
                <li>something@gmail.com</li>
            </ul>
        </div>
      
      </div>
      <div>
            {/* copyright text  */}
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ Prescripto - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer