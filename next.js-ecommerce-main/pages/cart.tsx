import { StoreContext } from '../utils/Store';
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineXCircle } from "react-icons/hi";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item: any) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.success('Item removed from cart!');
  };

  const updateCartHandler = async (item: any, qty: any) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Cart updated!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <h1 className='mb-6 text-3xl font-extrabold text-center text-pink-600 drop-shadow-lg'>🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className='text-center text-gray-700 font-medium'>
          Your cart is empty. <Link href='/' className='text-purple-600 hover:underline'>Back to Main page</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-6'>
          {/* Cart Table */}
          <div className='overflow-x-auto md:col-span-3 bg-white rounded-3xl shadow-xl backdrop-blur-sm bg-opacity-70 p-6 animate-fadeIn'>
            <table className='min-w-full text-left'>
              <thead className='border-b border-gray-300'>
                <tr>
                  <th className='px-5 py-2'>Item</th>
                  <th className='px-5 py-2 text-right'>Quantity</th>
                  <th className='px-5 py-2 text-right'>Price</th>
                  <th className='px-5 py-2 text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: any) => (
                  <tr key={item.slug} className='border-b border-gray-200 hover:bg-pink-50 transition duration-300'>
                    <td className='px-2 py-3 flex items-center gap-3'>
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className='rounded-lg shadow-md'
                        />
                      </Link>
                      <span className='font-medium text-gray-700'>{item.name}</span>
                    </td>
                    <td className='px-5 py-3 text-right'>
                      <select
                        value={item.quantity}
                        onChange={(e) => updateCartHandler(item, e.target.value)}
                        className='border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm'
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                    </td>
                    <td className='px-5 py-3 text-right font-semibold text-purple-700'>${item.price}</td>
                    <td className='px-5 py-3 text-center'>
                      <button onClick={() => removeItemHandler(item)} className='text-red-500 hover:text-red-700 transition'>
                        <HiOutlineXCircle size={24} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className='bg-white rounded-3xl shadow-xl backdrop-blur-sm bg-opacity-70 p-6 flex flex-col justify-between animate-fadeIn'>
            <ul className='space-y-4'>
              <li className='text-lg font-semibold text-gray-700'>
                Subtotal ({cartItems.reduce((a: any, c: any) => a + c.quantity, 0)} items): 
                <span className='text-pink-600 font-bold'> ${cartItems.reduce((a: any, c: any) => a + c.quantity * c.price, 0)}</span>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/shipping')}
                  className='w-full py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-500 hover:to-pink-400 transition duration-500 text-lg'
                >
                  🚚 Proceed to Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
