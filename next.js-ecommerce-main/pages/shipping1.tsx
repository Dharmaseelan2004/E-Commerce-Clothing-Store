import CheckoutWizard from '@/components/CheckoutWizard'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '@/utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface LoginFormValues {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
}

const ShippingScreen1 = () => {
    const router = useRouter()
    const { state, dispatch } = useContext(StoreContext)
    const { cart } = state
    const { shippingAddress } = cart

    const [formValue, setFormValue] = useState<LoginFormValues>({
        fullName: '',
        address: '',
        city: '',
        zip: '',
        country: '',
    })

    useEffect(() => {
        if (shippingAddress) {
            setFormValue({
                fullName: shippingAddress.fullName || '',
                address: shippingAddress.address || '',
                city: shippingAddress.city || '',
                zip: shippingAddress.zip || '',
                country: shippingAddress.country || '',
            })
        }
    }, [shippingAddress])

    const initialValues: LoginFormValues = {
        fullName: '',
        address: '',
        city: '',
        zip: '',
        country: '',
    }

    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required('Full Name is Required'),
        address: Yup.string()
            .required('Address is Required')
            .min(3, 'Address must be at least 3 characters'),
        city: Yup.string()
            .required('Please enter City'),
        zip: Yup.string()
            .matches(/^[0-9]{5}-[0-9]{3}$/, 'Format: 000000')
            .required('ZIP is Required'),
        country: Yup.string()
            .required('Please enter Country')
    });

    const handleSubmit = async ({ fullName, address, city, zip, country }: LoginFormValues) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, zip, country },
        })
        Cookies.set('cart', JSON.stringify({
            ...cart,
            shippingAddress: { fullName, address, city, zip, country },
        }))
        router.push('/payment')
    }

    return (
        <>
            <CheckoutWizard activeStep={1} />
            <Formik
                initialValues={formValue}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={handleSubmit}>
                <Form className='mx-auto max-w-screen-md'>
                    <h1 className='mb-4 text-xl'>Shipping Address</h1>

                    <div className='mb-4'>
                        <label htmlFor='fullName'>Full Name</label>
                        <Field className='w-full' id='fullName' name='fullName' placeholder="Full Name" autoFocus />
                        <div className='text-red-500'>
                            <ErrorMessage name='fullName' />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='address'>Address</label>
                        <Field className='w-full' id='address' name='address' placeholder="Address" />
                        <div className='text-red-500'>
                            <ErrorMessage name='address' />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='city'>City</label>
                        <Field className='w-full' id='city' name='city' placeholder="City" />
                        <div className='text-red-500'>
                            <ErrorMessage name='city' />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='zip'>ZIP</label>
                        <Field className='w-full' id='zip' name='zip' placeholder="ZIP" />
                        <div className='text-red-500'>
                            <ErrorMessage name='zip' />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='country'>Country</label>
                        <Field className='w-full' id='country' name='country' placeholder="Country" />
                        <div className='text-red-500'>
                            <ErrorMessage name='country' />
                        </div>
                    </div>

                    <div className='mb-4 flex justify-between'>
                        <button type='submit' className='primary-button'>Next</button>
                    </div>
                </Form>
            </Formik>
        </>
    )
}

ShippingScreen1.auth = true;
export default ShippingScreen1
