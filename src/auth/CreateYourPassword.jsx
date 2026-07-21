import React, { useState } from 'react'
import { useVerifyEmail } from '../store/Selectors/Auth/Auth_Selector';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from "yup";
import { setPassword } from '../Store/Action/Auth/Auth_Action';
import toast from 'react-hot-toast';
import { assets } from '../assets/images/assets';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const CreateYourPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const verifyEmail = useVerifyEmail();
  const [showPass, setShowPass] = useState(false);
  const [cShowPass, setCShowPass] = useState(false);
  const initialValues = {
    password: "",
    confirmPassword: "",
  }
  const handleValidation = Yup.object().shape({
    password: Yup.string().required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password not match!")
      .required("Confirm Password is Required"),
  });
  const handleSubmit = async (values) => {
    try {
      const payload = { email: verifyEmail, password: values?.password };
      const response = await dispatch(setPassword(payload));
      if (response?.IsSuccess) {
        toast.success(response?.Message);
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
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
                  <label className="label">Password <span className="text-[#FE5969]">*</span></label>
                  <div className="relative">
                    <Field type={showPass ? 'text' : 'password'} name="password" className="input" placeholder="Enter New Password" />
                    <span className="icon-eye text-20 text-g7 absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer" onClick={() => setShowPass(!showPass)}></span>
                  </div>
                  <ErrorMessage name='password' component='span' className='error -bottom-2.5'></ErrorMessage>
                </div>
                <div className='relative'>
                  <label className="label">Confirm Password <span className="text-[#FE5969]">*</span></label>
                  <div className="relative">
                    <Field type={cShowPass ? 'text' : 'password'} name="confirmPassword" className="input" placeholder="Enter Confirm Password" />
                    <span className="icon-eye text-20 text-g7 absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer" onClick={() => setCShowPass(!showPass)}></span>
                  </div>
                  <ErrorMessage name='confirmPassword' component='span' className='error -bottom-2.5'></ErrorMessage>
                </div>
              </div>
              <div><button type='submit' className={`btn_primary w-full hover:border-primary`}>Save</button></div>
              <div onClick={() => navigate("/")} className="flex justify-center items-center cursor-pointer mt-3 lg:mt-5 2xl:mt-7">
                <span className="font-extrabold text-12 xl:text-14 text-primary">Back to Login</span>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default CreateYourPassword