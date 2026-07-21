import React, { useState } from 'react';
import Header from '../../components/Header';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useCheckPermissionByPage } from '../../common/GlobalFunction';
import { MultiSelect } from 'primereact/multiselect';

const functionalityOptions = [
    { label: "Chat", value: "Chat" },
    { label: "Audio", value: "Audio" },
    { label: "Video", value: "Video" },
];

const AddEditPlanSubscription = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hasPermissionEdit = useCheckPermissionByPage("Admins", "update");
    const hasPermissionAdd = useCheckPermissionByPage("Admins", "insert");

    /* ================= INITIAL VALUES ================= */
    const initialValues = {
        planName: '',
        description: '',
        functionality: [], // [{ name, description }]
        monthlyPrice: '',
        yearlyPrice: '',
        friendsLimitMonthly: '',
        friendsLimitYearly: '',
        audioCallLimitMonthly: '',
        audioCallLimitYearly: '',
        videoCallLimitMonthly: '',
        videoCallLimitYearly: '',
    };

    /* ================= VALIDATION ================= */
    const validationSchema = Yup.object({
        planName: Yup.string().required('Plan Name is required'),
        description: Yup.string().required('Description is required'),
        functionality: Yup.array().of(Yup.string().required()).min(1, 'Select at least one functionality'),
        monthlyPrice: Yup.number().typeError('Monthly price must be a number').required('Monthly price is required'),
        yearlyPrice: Yup.number().typeError('Yearly price must be a number').required('Yearly price is required'),
    });
    const hasFeature = (values, feature) =>
        values.functionality.some(f => f === feature);


    /* ================= SUBMIT ================= */
    const handleSubmit = async (values) => {
        try {
            console.log("FINAL PAYLOAD 👉", values);
            // API CALL HERE
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Header name="Plan Subscription" />

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="gra p-5 md:p-6 lg:p-7 space-y-5 lg:space-y-7 2xl:space-y-9">
                            <div className="flex items-center">
                                <div className="flex items-center space-x-3.5 lg:space-x-5">
                                    <h6 className="text-18 md:text-20 xl:text-24 text-primary font-semibold">{id ? "Edit" : "Add"} Plan Subscription</h6>
                                </div>
                                <div className="ml-auto flex items-center space-x-2.5">
                                    <Link to="../admin" className="btn_secondary">Cancel</Link>
                                    {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-start -mx-1.5 xl:-mx-2.5 2xl:-mx-3.5">
                                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                    <label className="label">Plan Name  <span className="text-red">*</span></label>
                                    <Field type="text" name="planName" className="input" placeholder="Enter Plan Name" />
                                    <ErrorMessage component={"span"} name='planName' className='text-red error' />
                                </div>
                                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                    <label className="label">Description  <span className="text-red">*</span></label>
                                    <Field type="text" name="description" className="input" placeholder="Enter Description" />
                                    <ErrorMessage component={"span"} name='description' className='text-red error' />
                                </div>
                                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                    <label className="label">Plan Name  <span className="text-red">*</span></label>
                                    <MultiSelect value={values.functionality} options={functionalityOptions} onChange={(e) => setFieldValue('functionality', e.value)} placeholder="Select Functionality" maxSelectedLabels={3} className="w-full input flex" />
                                    <ErrorMessage component={"span"} name='functionality' className='text-red error' />
                                </div>
                                {hasFeature(values, "Chat") && (
                                    <>
                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Friends Limit (Monthly)</label>
                                            <Field
                                                type="number"
                                                name="friendsLimitMonthly"
                                                className="input"
                                                placeholder="Monthly Friends Limit"
                                            />
                                        </div>

                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Friends Limit (Yearly)</label>
                                            <Field
                                                type="number"
                                                name="friendsLimitYearly"
                                                className="input"
                                                placeholder="Yearly Friends Limit"
                                            />
                                        </div>
                                    </>
                                )}
                                {hasFeature(values, "Audio") && (
                                    <>
                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Audio Call Limit (Monthly)</label>
                                            <Field
                                                type="number"
                                                name="audioCallLimitMonthly"
                                                className="input"
                                                placeholder="Monthly Audio Limit"
                                            />
                                        </div>

                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Audio Call Limit (Yearly)</label>
                                            <Field
                                                type="number"
                                                name="audioCallLimitYearly"
                                                className="input"
                                                placeholder="Yearly Audio Limit"
                                            />
                                        </div>
                                    </>
                                )}
                                {hasFeature(values, "Video") && (
                                    <>
                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Video Call Limit (Monthly)</label>
                                            <Field
                                                type="number"
                                                name="videoCallLimitMonthly"
                                                className="input"
                                                placeholder="Monthly Video Limit"
                                            />
                                        </div>

                                        <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5">
                                            <label className="label">Video Call Limit (Yearly)</label>
                                            <Field
                                                type="number"
                                                name="videoCallLimitYearly"
                                                className="input"
                                                placeholder="Yearly Video Limit"
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                    <label className="label">Monthly Price  <span className="text-red">*</span></label>
                                    <Field type="text" name="monthlyPrice" className="input" placeholder="Enter Monthly Price" />
                                    <ErrorMessage component={"span"} name='monthlyPrice' className='text-red error' />
                                </div>
                                <div className="w-full xs:w-1/2 md:w-1/3 xl:w-1/4 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                    <label className="label">Yearly Price  <span className="text-red">*</span></label>
                                    <Field type="text" name="yearlyPrice" className="input" placeholder="Enter Yearly Price" />
                                    <ErrorMessage component={"span"} name='yearlyPrice' className='text-red error' />
                                </div>
                                <div className='w-full flex items-center justify-between p-1.5 xl:p-2.5 2xl:p-3.5 relative'>
                                    <div className="ml-auto">
                                        {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form >
                )}
            </Formik >
        </>
    );
}

export default AddEditPlanSubscription