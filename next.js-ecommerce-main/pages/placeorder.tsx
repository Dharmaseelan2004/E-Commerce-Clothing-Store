import CheckoutWizard from '@/components/CheckoutWizard'
import { getError } from '@/utils/error'
import { StoreContext } from '@/utils/Store'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'

import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const PlaceorderScreen = () => {
    const {state, dispatch} = useContext(StoreContext)
    const {cart} = state
    const {cartItems, shippingAddress, paymentMethod} = cart
    const round2 = (num:any) => Math.round(num * 100 + Number.EPSILON) / 100; 
    const router = useRouter()

    const itemsPrice = round2(cartItems.reduce((a:any,c:any) => a + c.quantity * c.price, 0))
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

    useEffect(() => {
        if (!paymentMethod){
            router.push('/payment')
        }
    },[paymentMethod, router])
    
    const [loading, setLoading] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const [contactTab, setContactTab] = useState<'phone'|'sms'|'email'>('phone')

    const placeOrderHandler = async () => {
        try{
            setLoading(true);
            const {data} = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            setLoading(false);
            dispatch({type: 'CART_CLEAR_ITEMS'});
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            );
            router.push(`/order/${data._id}`);
        }catch(err){
            setLoading(false);
            toast.error(getError(err))
        }
    }

    const ContactCard = () => (
        <div className="relative mt-4 p-6 rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-400 bg-gradient-to-br from-indigo-600 to-purple-500 text-white transform transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-purple-600 opacity-50 blur-3xl"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Contact Me</h3>
                    <div className="text-sm opacity-80">Fast Response</div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white bg-opacity-20 rounded-full p-1 w-max mb-4">
                    <button onClick={() => setContactTab('phone')} className={`px-4 py-1 rounded-full transition ${contactTab === 'phone' ? 'bg-white text-indigo-700 font-semibold scale-110 shadow-lg' : 'text-white'}`}>Phone</button>
                    <button onClick={() => setContactTab('sms')} className={`px-4 py-1 rounded-full transition ${contactTab === 'sms' ? 'bg-white text-indigo-700 font-semibold scale-110 shadow-lg' : 'text-white'}`}>SMS</button>
                    <button onClick={() => setContactTab('email')} className={`px-4 py-1 rounded-full transition ${contactTab === 'email' ? 'bg-white text-indigo-700 font-semibold scale-110 shadow-lg' : 'text-white'}`}>Email</button>
                </div>

                {/* Content */}
                <div className="p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-md">
                    {contactTab === 'phone' && (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm opacity-90 mb-1">Call Now</div>
                                <a href="tel:+919361090810" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:scale-105 transition-transform">📞 +91 93610 90810</a>
                            </div>
                        </div>
                    )}
                    {contactTab === 'sms' && (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm opacity-90 mb-1">Send SMS</div>
                                <a href="sms:+919361090810" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform">✉️ SMS +91 93610 90810</a>
                            </div>
                        </div>
                    )}
                    {contactTab === 'email' && (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <div className="text-sm opacity-90 mb-1">Send Email</div>
                                <a href="mailto:dharmaseelan12112004@gmail.com?subject=Order%20Help" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:scale-105 transition-transform">✉️ dharmaseelan12112004@gmail.com</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-3 text-sm opacity-90 animate-pulse">We typically reply within a few hours during working days.</div>
            </div>
        </div>
    )

  return (
    <>
    <CheckoutWizard activeStep={3}/>
     <h1 className='mb-4 text-xl'>Place Order</h1>
     {cartItems.length === 0 ? 
     (
     <div>
        Cart is empty. <Link href='/'>Go Shipping</Link>
     </div>
     ) : 
     (
        <div className='grid md:grid-cols-4 md:gap-5'>
            <div className='overflow-x-auto md:col-span-3'>
                <div className='card p-5 mb-4'>
                    <h2 className='mb-2 text-lg'>Shipping Address</h2>
                    <div>{shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.cep}, {shippingAddress.country}</div>
                    <div className='text-indigo-800 pt-2'><Link href='/shipping'>Edit</Link></div>
                </div>
                <div className='card p-5 mb-4'>
                    <h2 className='mb-2 text-lg'>Payment Method</h2>
                    <div>{paymentMethod}</div>
                    <div className='text-indigo-800 pt-2'><Link href='/payment'>Edit</Link></div>
                </div>
                <div className='card overflow-x-auto p-5 mb-4'>
                  <h2 className='mb-2 text-lg'>Order Items</h2>
                  <table className='min-w-full'>
                    <thead className='border-b'>
                      <tr>
                        <th className='px-5 text-left'>Item</th>
                        <th className='p-5 text-right'>Quantity</th>
                        <th className='p-5 text-right'>Price</th>
                        <th className='p-5 text-right'>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item:any)=>(
                        <tr key={item.slug} className='border-b'>
                          <td className='flex items-center gap-3 p-3'>
                            <Link href={`/product/${item.slug}`}><img src={item.image} alt={item.name} className='rounded shadow' width={50} height={50}/></Link>
                            <div className='text-sm'><Link href={`/product/${item.slug}`} className='font-medium'>{item.name}</Link></div>
                          </td>
                          <td className='p-5 text-right'>{item.quantity}</td>
                          <td className='p-5 text-right'>Rs{item.price}</td>
                          <td className='p-5 text-right'>Rs{item.quantity*item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='text-indigo-800 pt-2'><Link href='/cart'>Edit</Link></div>
                </div>

                <div className='flex justify-end gap-3'>
                    <button onClick={() => router.back()} className='inline-block px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition'>Back</button>
                    <button onClick={() => setShowContact(prev=>!prev)} className='inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition'>
                        {showContact ? 'Hide Contact' : 'Contact Me'}
                    </button>
                </div>
                {showContact && <ContactCard />}
            </div>
            <div>
                <div className='card p-5'>
                    <h2 className='mb-2 text-lg'>Order Summary</h2>
                    <ul>
                        <li className='flex justify-between mb-2'><div>Items</div><div>Rs{itemsPrice}</div></li>
                        <li className='flex justify-between mb-2'><div>Tax</div><div>Rs{taxPrice}</div></li>
                        <li className='flex justify-between mb-2'><div>Shipping</div><div>Rs{shippingPrice}</div></li>
                        <li className='flex justify-between mb-2'><div>Total</div><div>Rs{totalPrice}</div></li>
                        <li><button disabled={loading} onClick={placeOrderHandler} className='primary-button w-full'>{loading ? 'Loading...' : 'Place Order'}</button></li>
                    </ul>
                </div>
            </div>
        </div>
     )}
    </>
  )
}

PlaceorderScreen.auth = true
export default PlaceorderScreen