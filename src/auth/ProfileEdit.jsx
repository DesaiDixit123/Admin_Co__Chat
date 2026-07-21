import { ErrorMessage, Field, Form, Formik } from 'formik'
import { NAME_VALIDATION } from '../common/ErrorMessageCommon'
import * as Yup from 'yup'
import PhoneInput from 'react-phone-input-2'
import { imageArray } from '../common/CommonArray'
import toast from 'react-hot-toast'
import { Image } from 'primereact/image';
import { useDispatch } from 'react-redux'
import { toTitleCase } from '../common/GlobalFunction'
import { useUserProfile } from '../Store/Selectors/Auth/Auth_Selector'
import { updateProfile } from '../Store/Action/Auth/Auth_Action'

const ProfileEdit = ({ onClose }) => {

    const userProfile = useUserProfile()?.Data
    const dispatch = useDispatch()
    const initialValues = {
        profile: userProfile?.profile || "",
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        mobile: userProfile?.mobile || ""
    }

    const HandleValidation = Yup.object().shape({ name: Yup.string().required(NAME_VALIDATION), })

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append("name", toTitleCase(values?.name));
            formData.append("profile", values?.profile);
            const res = await dispatch(updateProfile(formData));
            if (res && res?.IsSuccess) { toast.success(res?.Message); onClose() }
        } catch (error) {
            console.error(error)
        }

    }

    const handleChangeImage = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (!imageArray.includes(file?.type)) { toast.error("File type is not allowed."); return; }
        setFieldValue("profile", file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
    }
    return (
        <>
            <div className="fixed h-screen inset-0 bg-g1/30 backdrop-blur-sm py-24 px-8 z-50 flex items-center justify-center overflow-y-auto ">
                <div className="bg-white w-full max-w-[542px] rounded-xl lg:rounded-2xl 2xl:rounded-[30px] px-5 lg:px-7 xl:px-9 py-3.5 lg:py-5 xl:py-7 mb-auto">
                    <div className="flex items-center justify-between mb-3.5 lg:mb-5">
                        <h2 className="text-g1 text24 font-semibold">Edit Profile</h2>
                        <span className="icon-close text-[24px] text-[#B01212] cursor-pointer" onClick={onClose}></span>
                    </div>
                    <Formik initialValues={initialValues} validationSchema={HandleValidation} onSubmit={handleSubmit} enableReinitialize>
                        {({ setFieldValue, values }) => (
                            <Form>
                                <div className="-mx-3">
                                    <div className="p-3">
                                        <div className="w-max relative mx-auto">
                                            <div className="w-16 h-16 2xl:w-20 2xl:h-20 bg-l3 border border-l2 rounded-full mx-auto overflow-hidden flex items-center justify-center">{values?.profile ? <Image src={typeof values.profile === "string" ? import.meta.env.VITE_BUCKET_URL + values.profile : URL.createObjectURL(values.profile)} alt="profile" className="w-full h-full object-cover" preview /> : <span className="icon-user text-[20px] md:text-[24px] lg:text-[32px] text-g7"></span>}</div>
                                            <div className="absolute -right-1.5 -bottom-1.5">
                                                <input type="file" name='profile' accept={imageArray.join(",")} className="absolute w-full h-full opacity-0 inset-0 z-10" onChange={(e) => handleChangeImage(e, setFieldValue, values)} />
                                                <div className="w-8 h-8 border-2 border-white bg-l3 rounded-full flex items-center justify-center">
                                                    <span className="icon-gallery text18 text-g7"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 relative">
                                        <label className="label">Name  <span className="text-red">*</span></label>
                                        <Field type="text" name="name" className="input" placeholder="Enter User Name" />
                                        <ErrorMessage component={"span"} name='name' className='error' />
                                    </div>
                                    <div className="p-3 relative">
                                        <label className="label">Mobile No.  <span className="text-red">*</span></label>
                                        <div className="input phone-input bg-l2">
                                            <PhoneInput value={values.mobile} onlyCountries={['in']} country='in' placeholder='12345-67890' disableCountryCode disableDropdown name="mobile" onChange={(value) => (setFieldValue("mobile", value))} disabled />
                                        </div>
                                        <ErrorMessage component={"span"} name='mobile' className='error' />
                                    </div>
                                    <div className="p-3 relative">
                                        <label className="label">Email <span className="text-red">*</span></label>
                                        <Field type="text" name="email" className="input cursor-not-allowed bg-l2" placeholder="Enter Email" readOnly />
                                        <ErrorMessage component={"span"} name='email' className='error' />
                                    </div>
                                </div>
                                <div className="w-full max-w-[115px] mx-auto mt-4 lg:mt-6">
                                    <button type="submit" className="btn_primary hover:border-primary">Save</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default ProfileEdit