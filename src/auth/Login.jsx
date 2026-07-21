import React, { useEffect } from 'react'
import { assets } from '../assets/images/assets'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PASSWORD_VALIDATION, USERNAME_VALIDATION, } from '../common/ErrorMessageCommon'
import { useDispatch } from 'react-redux'
import { login } from '../Store/Action/Auth/Auth_Action'
import toast from 'react-hot-toast'

const Login = () => {
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const initialValues = {
        username: '',
        password: '',
    }

    const handleValidation = Yup.object({
        username: Yup.string().required(USERNAME_VALIDATION),
        password: Yup.string().required(PASSWORD_VALIDATION),
    });

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            const response = await dispatch(login(values));
            if (response?.IsSuccess) {
                localStorage.setItem('accessToken', response?.Data?.accesstoken);
                toast.success(response?.Message);
                navigate("/dashboard");
            }
        } catch (err) {
            console.log("error", err);
        }
        setLoading(false)
    }
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) { navigate('/dashboard'); }
    }, []);

    return (
        <>
            <div className="w-full min-h-screen  flex relative py-6 lg:py-8 2xl:py-10 px-5 2xl:px-6 bg-primary/10">
                <div className="w-full mx-auto px-5 h-full my-auto flex flex-col items-center justify-center">
                    <img src={assets.logo} className="max-w-48 mb-7" alt="logo" />
                    <Formik initialValues={initialValues} validationSchema={handleValidation} onSubmit={handleSubmit}>
                        <Form className="w-full max-w-96 xl:max-w-[530px] bg-white rounded-xl lg:rounded-2xl 2xl:rounded-[20px] p-6 md:p-8 lg:p-10 2xl:p-12 my-auto">
                            <h4 className="text24 text-g1 font-semibold text-center">Admin Login</h4>
                            <div className="space-y-2.5 lg:space-y-3 2xl:space-y-5 my-3 lg:my-5 2xl:my-7">
                                <div className='relative'>
                                    <label className="label">User Name <span className="text-[#FE5969]">*</span></label>
                                    <Field type="text" name="username" className="input" placeholder="Enter User Name" />
                                    <ErrorMessage name='username' component='span' className='error -bottom-2'></ErrorMessage>
                                </div>
                                <div className='relative'>
                                    <label className="label">Password <span className="text-[#FE5969]">*</span></label>
                                    <div className="relative">
                                        <Field type={showPass ? "text" : "password"} name="password" className="input" placeholder="Enter Password" />
                                        <span className="icon-eye text-20 text-g7 absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer" onClick={() => setShowPass(!showPass)}></span>
                                    </div>
                                    <ErrorMessage name='password' component='span' className='error -bottom-2'></ErrorMessage>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div onClick={() => navigate("/forget-password")} className="text-center cursor-pointer">
                                        <span className="font-extrabold text-12 xl:text-14 text-primary">Forgot password?</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type='submit' className="btn_primary w-full hover:border-primary" disabled={loading}>{loading ? "Login..." : "Login"}</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default Login