import React, { useEffect } from 'react'
import Header from '../../components/Header'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { ErrorMessage, Form, Formik } from 'formik'
import CustomDropdown from '../../components/UI/CustomDropdown'
import toast from 'react-hot-toast'
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
const SupportTicketDetails = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const Status = [{ value: "Pending", label: "Pending" }, { value: "In Progress", label: "In Progress" }, { value: "Resolved", label: "Resolved" },];
    const TicketData = {}
    const initialValues = {
        message: '',
        status: TicketData?.status || '',
    }

    const handleValidationSchema = Yup.object().shape({
        message: Yup.string().required("message Is Required"),
        status: Yup.string().required("Status Is Required"),
    })

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                ticket_id: id,
                message: values?.message,
                status: values?.status
            }
            // const response = await dispatch(supportTicketResponse(payload))
            // if (response.IsSuccess) {
            //     toast.success(response.Message)
            //     resetForm()
            //     GetSupportTicketData()
            // }
        } catch (error) {
            console.log('error', error)
        }
    }

    const GetSupportTicketData = async () => {
        try {
            const payload = {
                ticket_id: id
            }
            // await dispatch(supportTicketGetOne(payload))
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => { GetSupportTicketData() }, [])

    return (
        <>
            <Header name="Support Ticket" />
            <div className="p-5 lg:p-7 mx-auto">

                <div className="flex items-center space-x-3 mb-6">
                    <Link to="../users" className="icon-arrow-right rotate-180 text-20" />
                    <h2 className="text24 font-bold text-g1">User Details</h2>
                </div>
                <div className=" space-y-5 lg:space-y-7 2xl:space-y-9">
                    <div>
                        <div className="bg-l4 rounded-xl py-3.5 lg:py-5 xl:py-6 px-4 lg:px-5 xl:px-7">
                            <div className="flex flex-wrap items-center -mx-2 xl:-mx-3">
                                <div className="w-full xs:w-1/2 xl:w-5/12 2xl:w-[20%] p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Ticket ID</span>
                                    <span className="text-14 md:text-16 xl:text-18 3xl:text-20 font-semibold text-g1 whitespace-nowrap">#{TicketData?.ticket_no || "-"}</span>

                                </div>
                                <div className="w-1/2 xl:w-3/12 2xl:w-[20%] p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Date</span>
                                    <span className="text-14 md:text-16 xl:text-18 3xl:text-20 font-semibold text-g1 whitespace-nowrap">{moment.utc(TicketData?.createdAt).format('DD-MM-YYYY')}</span>
                                </div>
                                <div className="w-full xs:w-1/2 xl:w-4/12 2xl:w-[35%] p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Name of submitter</span>
                                    <div className="flex items-center space-x-1.5 2xl:space-x-2.5">
                                        <div>
                                            {/* <div className="w-5 2xl:w-7 h-5 2xl:h-7 rounded-full overflow-hidden">
                                            <img src={assets.profile} className="w-full h-full object-cover" alt="profile" />
                                        </div> */}
                                        </div>
                                        <span className="text-14 md:text-16 xl:text-18 3xl:text-20 font-semibold text-g1 whitespace-nowrap">{TicketData?.related_user?.full_name || TicketData?.related_user?.owner_name || TicketData?.related_user?.driver_name || "-"}</span>
                                    </div>
                                </div>
                                <div className="w-1/2 xl:w-3/12 2xl:w-[16%] p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Ticket Category</span>
                                    <span className="text-14 md:text-16 xl:text-18 3xl:text-20 font-semibold text-g1 whitespace-nowrap">{TicketData?.issue_type || "-"}</span>
                                </div>
                                <div className="w-full p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Description</span>
                                    <span className="text-14 md:text-16 xl:text-18 3xl:text-20 font-semibold text-g1" >{TicketData?.description || "-"}</span>
                                </div>
                                {TicketData?.attachment && <div className="w-full p-2 xl:p-3">
                                    <span className="block text-12 md:text-14 font-semibold text-g7 mb-1 2xl:mb-2.5">Attached Screenshot or Photo</span>
                                    <div className="w-28 md:w-32 lg:w-40 xl:w-[182px] h-20 md:h-24 lg:h-32 xl:h-[140px] relative overflow-hidden rounded-xl">
                                        <img src={import.meta.env.VITE_BUCKET_URL + TicketData?.attachment} alt="ss" className="w-full h-full object-cover" />
                                        {/* <span className="icon-close text-[20px] rounded-full text-red absolute -right-1.5 -top-1.5"></span> */}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <Formik initialValues={initialValues} validationSchema={handleValidationSchema} onSubmit={handleSubmit} enableReinitialize>
                        {({ setFieldValue, values }) => (
                            <Form>
                                <div>
                                    <h6 className="text-16 xl:text-20 font-bold text-primary mb-2.5 xl:mb-4">Response to Ticket</h6>

                                    <div className="flex flex-wrap items-start -mx-1.5 xl:-mx-2.5 2xl:-mx-3.5 relative">
                                        <div className="w-full md:w-1/2 lg:w-7/12 p-1.5 xl:p-2.5 2xl:p-3.5">
                                            <label className="label">Answer <span className="text-red">*</span></label>
                                            <textarea type="text" rows="3" className="input" placeholder="Enter message" value={values.message} onChange={(e) => setFieldValue("message", e.target.value)}></textarea>
                                            <ErrorMessage name="message" component="span" className="error text-red" />
                                        </div>
                                        <div className="w-full md:w-1/2 lg:w-5/12 p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                                            <label className="label">Status</label>
                                            <CustomDropdown value={values.status} onChange={(e) => setFieldValue("status", e)} options={Status} placeholder='Select Status' className='input' />
                                            <ErrorMessage name="status" component="span" className="error text-red" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type='submit' className="btn_primary max-w-28 lg:max-w-[250px] hover:border-primary">Submit</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>

        </>
    )
}

export default SupportTicketDetails