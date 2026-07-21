import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { EMAIL_REGEX, EMAIL_VALIDATION, INVALID_EMAIL_VALIDATION, MOBILE_VALIDATION, NAME_VALIDATION } from '../../../common/ErrorMessageCommon'
import { imageArray } from '../../../common/CommonArray'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import PhoneInput from 'react-phone-input-2'
import CustomDropdown from '../../../components/UI/CustomDropdown'
import { roleListWithoutPagination } from '../../../Store/Action/AdminSetup/Role/Role_Action'
import { adminGetOne, adminSave } from '../../../Store/Action/AdminSetup/Admin/Admin_Action'
import { useRoleWithoutPage } from '../../../Store/Selectors/AdminSetup/Role/Role_Selector'
import { useAdminData } from '../../../Store/Selectors/AdminSetup/Admin/Admin_Selector'
import CommonImageUpload from '../../../common/CommonImageUpload'
import { downloadImage, handleDeleteImage, useCheckPermissionByPage } from '../../../common/GlobalFunction'
const AddEditAdmin = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [profileObj, setProfileObj] = useState(null)
  const [isFileUpload, setIsFileUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false);
  const roleList = useRoleWithoutPage()
  const admin = useAdminData()
  const navigate = useNavigate()
  const adminData = id ? admin?.Data : ""
  const hasPermissionEdit = useCheckPermissionByPage("Admins", "update");
  const hasPermissionAdd = useCheckPermissionByPage("Admins", "insert");

  const initialValues = {
    profile: adminData?.profile || "",
    adminuserid: adminData?._id || "",
    roleid: adminData?.roleid?._id || "",
    name: adminData?.name || "",
    email: adminData?.email || "",
    country_code: adminData?.country_code || "",
    mobile: adminData?.mobile || "",
    country_wise_contact: adminData?.country_wise_contact || "",
    login_username: adminData?.login_username || "",
    login_password: adminData?.login_password || "",
  }

  const HandleValidation = Yup.object().shape({
    name: Yup.string().required(NAME_VALIDATION),
    email: Yup.string().matches(EMAIL_REGEX, INVALID_EMAIL_VALIDATION).required(EMAIL_VALIDATION),
    mobile: Yup.string().required(MOBILE_VALIDATION),
    login_username: Yup.string().required('Login Username Required'),
    login_password: Yup.string().required('Login Password Required'),
    roleid: Yup.string().required("Select Role Name")
  })


  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("adminuserid", values?.adminuserid || "");
      formData.append("roleid", values?.roleid);
      formData.append("name", values?.name);
      formData.append("email", values?.email);
      formData.append("country_code", values?.country_code);
      formData.append("mobile", values?.mobile);
      formData.append("country_wise_contact", JSON.stringify(values?.country_wise_contact));
      formData.append("login_username", values?.login_username);
      formData.append("login_password", values?.login_password)

      formData.append("profile", values?.profile);

      const response = await dispatch(adminSave(formData))
      if (response.IsSuccess) {
        toast.success(response.Message)
        navigate("../admin")
      }

    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleChangeImage = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (!imageArray.includes(file?.type)) {
      toast.error("File type is not allowed.");
      return;
    }
    setFieldValue("profile", file);
    setIsFileUpload(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setProfileObj(e.target.result);
    };
  }

  const GetRoleList = async () => {
    const payload = { search: "" }
    await dispatch(roleListWithoutPagination(payload))
  }

  const GetAdminData = async () => {
    try {
      if (id) {
        const payload = { adminuserid: id || "" }
        await dispatch(adminGetOne(payload))
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => { GetRoleList() }, [])
  useEffect(() => { GetAdminData() }, [])

  return (
    <>
      <Header name={"Admins"} />
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={HandleValidation} enableReinitialize>
        {({ values, setFieldValue }) => (
          <Form>
            <div className="gra p-5 md:p-6 lg:p-7 space-y-5 lg:space-y-7 2xl:space-y-9">
              <div className="flex items-center">
                <div className="flex items-center space-x-3.5 lg:space-x-5">
                  <h6 className="text-18 md:text-20 xl:text-24 text-primary font-semibold">{id ? "Edit" : "Add"} Admin</h6>
                </div>
                <div className="ml-auto flex items-center space-x-2.5">
                  <Link to="../admin" className="btn_secondary">Cancel</Link>
                  {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                </div>
              </div>
              <div className="flex flex-wrap items-start -mx-1.5 xl:-mx-2.5 2xl:-mx-3.5">
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Profile </label>
                  <CommonImageUpload setFieldValue={setFieldValue} fieldName={'profile'} accept={imageArray}>
                    <div className="input relative border border-dashed flex items-center justify-between">
                      {
                        !values.profile && values.profile == '' ? <>
                          <div className="text-center flex items-center justify-center space-x-2 w-full">
                            <span className="text-[20px] 2xl:text-[24px] font-medium text-g1 icon-export"></span>
                            <span className="text-12 md:text-14 2xl:text-16 text-g7">Upload Photo</span>
                          </div>
                        </> : <><span className='text-12 md:text-14 2xl:text-16 text-g1 truncate text-ellipsis overflow-hidden'>{typeof values.profile === "string" ? values.profile.split("/").pop() : values.profile.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="icon-eye text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={(e) => { e.stopPropagation(); downloadImage(typeof values.profile === "string" ? import.meta.env.VITE_BUCKET_URL + values.profile : URL.createObjectURL(values.profile), 'profile') }}></span>
                            <span className="icon-trash text-[18px] lg:text-[20px] xl:text-[24px] text-red cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDeleteImage(setFieldValue, 'profile') }}></span>
                          </div>
                        </>
                      }
                    </div>
                  </CommonImageUpload>
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Name  <span className="text-red">*</span></label>
                  <Field type="text" name="name" className="input" placeholder="Enter Name" />
                  <ErrorMessage component={"span"} name='name' className='text-red error' />
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Mobile No.  <span className="text-red">*</span></label>
                  <div className="input phone-input">
                    <PhoneInput name="mobile" value={values.country_code + values.mobile} onChange={(phone, countryData) => {
                      setFieldValue("mobile", phone.slice(countryData.dialCode.length));
                      setFieldValue("country_code", `+${countryData.dialCode}`);
                      setFieldValue("country_wise_contact", { ...countryData, localFormate: phone, withoutDialCode: phone.slice(countryData.dialCode.length), });
                    }} country={"in"} inputProps={{ name: "mobile", required: true, }} />
                  </div>
                  <ErrorMessage component={"span"} name='mobile' className='text-red error' />
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Email <span className="text-red">*</span></label>
                  <Field type="text" name="email" className="input" placeholder="Enter Email" />
                  <ErrorMessage component={"span"} name='email' className='text-red error' />
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Role <span className="text-red">*</span></label>
                  <CustomDropdown value={values.roleid} options={(roleList?.Data || [])?.map((item) => ({ label: item.name, value: item._id }))} placeholder="Select Role" onChange={(val) => { setFieldValue("roleid", val) }} className='input' />
                  <ErrorMessage component={"span"} name='roleid' className='text-red error' />
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Login Username <span className="text-red">*</span></label>
                  <Field type="text" name="login_username" className="input" placeholder="Enter Login USerName" />
                  <ErrorMessage component={"span"} name='login_username' className='text-red error' />
                </div>
                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Login Password <span className="text-red">*</span></label>
                  <div className="relative">
                    <Field type={showPass ? "text" : "password"} name="login_password" className="input" placeholder="Enter Login Password" />
                    <span className="icon-eye text-[20px] text-g7 absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer" onClick={() => setShowPass(!showPass)}></span>
                  </div>
                  <ErrorMessage component={"span"} name='login_password' className='text-red error' />
                </div>
                <div className='w-full flex items-center justify-between p-1.5 xl:p-2.5 2xl:p-3.5 relative'>
                  <div className="ml-auto">
                    {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AddEditAdmin