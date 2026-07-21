import React, { useState } from 'react'
import { assets } from '../assets/images/assets'
import toast from 'react-hot-toast';
import { EMAIL_REGEX, EMAIL_VALIDATION, INVALID_EMAIL_VALIDATION } from '../common/ErrorMessageCommon';
import * as Yup from 'yup'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { forgetPassword, setVerifyEmail } from '../Store/Action/Auth/Auth_Action';
const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const initialValues = { email: "" }

  const handleValidation = Yup.object({ email: Yup.string().required(EMAIL_VALIDATION).matches(EMAIL_REGEX, INVALID_EMAIL_VALIDATION) })

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const payload = { ...values, email: values.email.toLowerCase() }
      const response = await dispatch(forgetPassword(payload));
      dispatch(setVerifyEmail(payload?.email));
      if (response?.IsSuccess) {
        if (response?.Data === 1) {
          toast.success(response?.Message);
          setIsLoading(false);
          navigate("/verify-otp");
        } else if (!response?.Data?.is_pinset) {
          toast.success(response?.Message);
          setIsLoading(false);
          navigate("/create-your-password");
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.log("error", error)
    }
  }


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
                  <label className="label">Email <span className="text-[#FE5969]">*</span></label>
                  <Field type="text" name="email" className="input" placeholder="Enter Email" />
                  <ErrorMessage name='email' component='span' className='error -bottom-2'></ErrorMessage>
                </div>
              </div>
              <div>
                <button type='submit' disabled={isLoading} className={`btn_primary w-full hover:border-primary ${isLoading ? "cursor-not-allowed" : ""} `}>
                  {isLoading ? 'Otp sent...' : 'Reset'}
                </button>
              </div>
              <div onClick={() => navigate("/")} className="flex justify-center items-center cursor-pointer mt-3 lg:mt-5 2xl:mt-7">
                <span className="font-extrabold text-12 xl:text-14 text-primary ">Back to Login</span>
              </div>
            </Form>
          </Formik>
        </div>

      </div>
    </>
  )
}

export default ForgetPassword