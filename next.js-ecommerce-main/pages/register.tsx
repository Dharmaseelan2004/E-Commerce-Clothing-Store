import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

interface LoginFormValues {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .min(6, 'Confirm Password must be at least 6 characters')
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const initialValues: LoginFormValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
};

const RegisterScreen = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect]);

  const handleSubmit = async ({ name, email, password }: LoginFormValues) => {
    try {
      await axios.post('/api/auth/signup', { name, email, password })

      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 px-4 animate-gradient">
      <div className="max-w-md w-full bg-white backdrop-blur-sm bg-opacity-70 p-8 rounded-3xl shadow-2xl border border-pink-300 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-pink-600 font-sans drop-shadow-lg">✨ Create Account ✨</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className='space-y-5'>
            {/* Username */}
            <div>
              <label htmlFor='name' className="block text-purple-700 font-bold mb-1">Username</label>
              <Field
                autoFocus
                className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300'
                type="text"
                id="name"
                name="name"
                placeholder="Enter your anime name"
              />
              <div className='text-red-500 text-sm mt-1'>
                <ErrorMessage name="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor='email' className="block text-purple-700 font-bold mb-1">Email</label>
              <Field
                className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300'
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
              />
              <div className='text-red-500 text-sm mt-1'>
                <ErrorMessage name="email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className="block text-purple-700 font-bold mb-1">Password</label>
              <Field
                className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300'
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
              />
              <div className='text-red-500 text-sm mt-1'>
                <ErrorMessage name="password" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmpassword' className="block text-purple-700 font-bold mb-1">Confirm Password</label>
              <Field
                className='w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-lg transition duration-300'
                type="password"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirm your password"
              />
              <div className='text-red-500 text-sm mt-1'>
                <ErrorMessage name="confirmpassword" />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full py-2 px-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl shadow-lg hover:from-purple-500 hover:to-pink-400 transition-all duration-500 font-bold text-lg'
              >
                ✨ Register ✨
              </button>
            </div>
          </Form>
        </Formik>

        <p className="text-center text-purple-700 mt-4 font-semibold">
          Already have an account? &nbsp;
          <Link className='text-pink-500 font-bold hover:underline' href={`/login?redirect=${redirect || '/'}`}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterScreen
