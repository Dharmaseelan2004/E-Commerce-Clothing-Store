import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const LoginScreen = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, session, redirect]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    try {
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-pink-200 to-purple-300 overflow-hidden">
      {/* Background animated streaks */}
      <div className="absolute inset-0 before:content-[''] before:absolute before:w-[200%] before:h-[200%] before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-white/10 before:animate-backgroundShift"></div>

      {/* Card */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 transform transition hover:-translate-y-2 hover:scale-105 duration-500">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-indigo-700 animate-titlePulse">✨ Login ✨</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className='space-y-6'>
            {/* Email Field */}
            <div className="relative">
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition duration-300 peer placeholder-transparent"
              />
              <label htmlFor="email" className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-indigo-600 peer-focus:text-sm">
                Email
              </label>
              <div className='text-red-500 text-xs mt-1'><ErrorMessage name="email" /></div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition duration-300 peer placeholder-transparent"
              />
              <label htmlFor="password" className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-indigo-600 peer-focus:text-sm">
                Password
              </label>
              <div className='text-red-500 text-xs mt-1'><ErrorMessage name="password" /></div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-300 animate-buttonPulse'
              >
                Login ✨
              </button>
            </div>
          </Form>
        </Formik>

        <p className="text-center text-gray-700 mt-4 font-semibold">
          Don't have an account? &nbsp;
          <Link className='text-indigo-500 font-bold hover:text-pink-500 transition duration-300' href={`/register?redirect=${redirect || '/'}`}>
            Register
          </Link>
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes backgroundShift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-50px) translateY(20px); }
          100% { transform: translateX(0) translateY(0); }
        }
        .animate-backgroundShift {
          animation: backgroundShift 15s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%,100% { color: #5a67d8; }
          50% { color: #d53f8c; }
        }
        .animate-titlePulse {
          animation: titlePulse 2s ease-in-out infinite;
        }

        @keyframes buttonPulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 10px rgba(99, 102, 241, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
        }
        .animate-buttonPulse {
          animation: buttonPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoginScreen
