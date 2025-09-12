import CheckoutWizard from '@/components/CheckoutWizard'
import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { StoreContext } from '@/utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentScreen = () => {
  const [selectPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showScanner, setShowScanner] = useState(false);
  const { state, dispatch } = useContext(StoreContext)
  const { cart } = state
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter()

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectPaymentMethod) {
      return toast.error('Payment Method not selected')
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectPaymentMethod })
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectPaymentMethod,
      })
    );
    router.push('placeorder')
  }

  useEffect((): any => {
    if (!shippingAddress) {
      return router.push('/shipping')
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress?.address])

  return (
    <>
      <CheckoutWizard activeStep={2} />
      <form 
        className='mx-auto max-w-screen-md bg-white shadow-lg p-6 rounded-2xl border border-gray-200' 
        onSubmit={submitHandler}
      >
        <h1 className='mb-6 text-2xl font-bold text-gray-800 text-center'>
          💳 Choose Your Payment Method
        </h1>

        <div className="space-y-4">
          {['PayPal', 'Stripe', 'CashOnDelivery', 'Pay via GPay 9361090810'].map((payment) => (
            <label 
              key={payment} 
              htmlFor={payment}
              className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition
                ${selectPaymentMethod === payment 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-300 hover:border-blue-400'
                }`}
            >
              <input
                name='paymentMethod'
                id={payment}
                type='radio'
                checked={selectPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
                className="h-4 w-4 text-blue-600 focus:ring-0"
              />
              <span className="text-gray-700 font-medium">{payment}</span>
            </label>
          ))}
        </div>

        {/* ✅ New Button to Show Scanner */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            {showScanner ? 'Hide Scanner' : 'Show Scanner'}
          </button>
        </div>

        {/* ✅ Scanner Image with animation */}
        <AnimatePresence>
          {showScanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex flex-col items-center"
            >
              <img 
                src="/images/scanner.png" 
                alt="GPay Scanner" 
                className="w-64 h-64 rounded-2xl shadow-xl border border-gray-200"
              />
              <p className="mt-3 text-gray-600 font-semibold">
                📲 Scan this QR to Pay
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='mt-8 flex justify-between'>
          <button
            className='default-button bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow-sm'
            type='button'
            onClick={() => router.push('/shipping')}
          >
            ⬅ Back
          </button>
          <button className='primary-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg' type='submit'>
            Next ➡
          </button>
        </div>
      </form>
    </>
  )
}
PaymentScreen.auth = true
export default PaymentScreen
