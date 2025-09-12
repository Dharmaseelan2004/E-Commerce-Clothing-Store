import CheckoutWizard from '@/components/CheckoutWizard'
import { StoreContext } from '@/utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
};

const ShippingScreen = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(StoreContext)
  const { cart } = state
  const { shippingAddress } = cart

  const { handleSubmit, register, formState: { errors }, setValue } = useForm<FormValues>()

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('zip', shippingAddress.zip || shippingAddress.cep)
    setValue('country', shippingAddress.country)
    setValue('phone', shippingAddress.phone || '')
  }, [setValue, shippingAddress])

  const submitHandler = async ({ fullName, address, city, zip, country, phone }: FormValues) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, zip, country, phone },
    })
    Cookies.set('cart', JSON.stringify({
      ...cart,
      shippingAddress: { fullName, address, city, zip, country, phone },
    }))
    router.push('/payment')
  }

  return (
    <>
      <CheckoutWizard activeStep={1} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
        <form 
          className='w-full max-w-lg bg-white backdrop-blur-sm bg-opacity-70 rounded-3xl p-8 shadow-2xl animate-fadeIn'
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className='mb-6 text-3xl font-extrabold text-center text-pink-600 drop-shadow-lg'>📦 Shipping Address</h1>

          {/* Full Name */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>Full Name</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('fullName', { required: true, minLength: 3 })} 
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className='text-red-500 text-sm mt-1 block'>Full name is required (min 3 characters)</span>}
          </div>

          {/* Address */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>Address</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('address', { required: true, minLength: 3 })} 
              placeholder="Enter your address"
            />
            {errors.address && <span className='text-red-500 text-sm mt-1 block'>Address is required (min 3 characters)</span>}
          </div>

          {/* City */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>City</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('city', { required: true })} 
              placeholder="Enter your city"
            />
            {errors.city && <span className='text-red-500 text-sm mt-1 block'>City is required</span>}
          </div>

          {/* ZIP */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>ZIP</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('zip', { required: true, pattern: /^[0-9]{5}(?:-[0-9]{3})?$/ })} 
              placeholder="00000-000"
            />
            {errors.zip && <span className='text-red-500 text-sm mt-1 block'>ZIP is required and must be in format 00000-000</span>}
          </div>

          {/* Country */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>Country</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('country', { required: true })} 
              placeholder="Enter your country"
            />
            {errors.country && <span className='text-red-500 text-sm mt-1 block'>Country is required</span>}
          </div>

          {/* Phone */}
          <div className='mb-4'>
            <label className='block mb-1 text-purple-700 font-semibold'>Phone Number</label>
            <input 
              type="text" 
              className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300' 
              {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })} 
              placeholder="Enter your phone number (10 digits)"
            />
            {errors.phone && <span className='text-red-500 text-sm mt-1 block'>Valid phone number is required (10 digits)</span>}
          </div>

          {/* Submit Button */}
          <button 
            className='w-full py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-500 hover:to-pink-400 transition duration-500 text-lg'
            type="submit"
          >
            🚚 Continue to Payment
          </button>
        </form>
      </div>
    </>
  )
}

ShippingScreen.auth = true;
export default ShippingScreen
