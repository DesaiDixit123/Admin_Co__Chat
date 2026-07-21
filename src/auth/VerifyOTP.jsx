import React, { useRef, useState } from 'react'
import { forgetPassword, verifyOtp } from '../Store/Action/Auth/Auth_Action';
import { usePageName, useVerifyEmail } from '../store/Selectors/Auth/Auth_Selector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import toast from 'react-hot-toast';
import * as Yup from 'yup'
import { assets } from '../assets/images/assets';
import { Field, Form, Formik } from 'formik';
const VerifyOTP = () => {
  const OTP_LENGTH = 6;

  const [disableSendButton, setDisableSendButton] = useState(false);
  const verifyEmail = useVerifyEmail()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pageOtp = usePageName();
  const otpRefs = useRef([...Array(OTP_LENGTH)].map(() => React.createRef()));
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 60); // 60 seconds
  const { seconds, minutes, restart } = useTimer({ expiryTimestamp, onExpire: () => { setDisableSendButton(true); }, });
  // Timer setup with react-timer-hook
  const startNewTimer = () => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + 60);
    restart(newExpiryTimestamp);
    setDisableSendButton(false);
  };

  const handleSendAgain = async () => {
    try {
      if (disableSendButton) {
        restart();
        const response = pageOtp === "forgetPassword" ? await dispatch(forgetPassword({ email: verifyEmail })) : ''
        if (response?.IsSuccess) {
          toast.success(response?.Message);
          startNewTimer();
          setDisableSendButton(false);
        }
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      otpRefs.current[index - 1].current.focus();
    }
  };
  const handlePaste = (e, setFieldValue) => {
    const paste = e.clipboardData.getData("text");

    if (!/^[0-9]+$/.test(paste)) return;

    const digits = paste.split("").slice(0, OTP_LENGTH);

    digits.forEach((digit, index) => {
      setFieldValue(`otp[${index}]`, digit);
    });

    // focus last filled field
    const lastIndex = digits.length - 1;
    otpRefs.current[lastIndex]?.current?.focus();

    e.preventDefault();
  };
  const handleChange = (e, index, setFieldValue) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      setFieldValue(`otp[${index}]`, value);
      if (value && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleValidationSchema = Yup.object().shape({
    otp: Yup.array().required("OTP is required").test("all-digits", "OTP must be 6 digits", (value) => { return Array.isArray(value) && value.every((v) => /^[0-9]$/.test(v)); })
  })

  const handleSubmit = async (values) => {
    try {
      const otpString = values.otp.join("");
      const payload = { email: verifyEmail, otp: otpString };
      const response = await dispatch(verifyOtp({ ...payload }));
      if (response?.IsSuccess) {
        navigate("/create-your-password");
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  }

  return (
    <>
      <div className="w-full min-h-screen  flex relative py-6 lg:py-8 2xl:py-10 px-5 2xl:px-6 bg-primary/10">
        <div className="w-full mx-auto px-5 h-full my-auto flex flex-col items-center justify-center">
          <img src={assets.logo} className="max-w-48 mb-7" alt="logo" />
          <Formik initialValues={{ otp: Array(OTP_LENGTH).fill("") }} validationSchema={handleValidationSchema} onSubmit={handleSubmit}>
            {({ setFieldValue, values, errors }) => (
              <Form className="w-full max-w-96 xl:max-w-[530px] bg-white rounded-xl lg:rounded-2xl 2xl:rounded-[20px] p-6 md:p-8 lg:p-10 2xl:p-12 my-auto">
                <h4 className="text24 text-g1 font-semibold mb-3. lg:mb-5 xl:mb-7">Enter OTP</h4>
                <div className="space-y-2.5 lg:space-y-3 2xl:space-y-5 my-3 lg:my-5 2xl:my-7">
                  <div>
                    <label className="label">Enter OTP <span className="text-[#FE5969]">*</span></label>
                    <div className="flex items-center space-x-4">
                      {values.otp.map((_, index) => (
                        <Field name={`otp[${index}]`} key={index}>
                          {({ field }) => (
                            <input {...field} type="text" maxLength="1" className="input text-center" placeholder="0" ref={otpRefs.current[index]} onKeyDown={(e) => handleKeyDown(e, index)} onChange={(e) => handleChange(e, index, setFieldValue)} onPaste={(e) => handlePaste(e, setFieldValue)}
                            />
                          )}
                        </Field>
                      ))}
                    </div>

                    {/* Global error */}
                    {typeof errors.otp === 'string' && (<div className="text-xs mt-2">{errors.otp}</div>)}
                    <div className="flex items-center justify-between mt-2.5 xl:mt-4">
                      <span className="text-12 font-semibold text-primary">{minutes}:{seconds.toString().padStart(2, "0")}</span>
                      <span className={`font-extrabold text-12 xl:text-14 ${disableSendButton ? "text-primary cursor-pointer" : "text-gray-600 cursor-not-allowed"} `} onClick={() => { handleSendAgain(); }}>Send Again</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button type='submit' className="btn_primary w-full hover:border-primary">Verify</button>
                </div>
                <div onClick={() => navigate("/")} className="flex justify-center items-center cursor-pointer mt-3 lg:mt-5 2xl:mt-7">
                  <span className="font-extrabold text-12 xl:text-14 text-primary ">Back to Login</span>
                </div>
              </Form>)}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default VerifyOTP