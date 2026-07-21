import React, { useState } from 'react'
import Header from '../../components/Header'
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import * as Yup from "yup";
import { categoriesSave } from '../../Store/Action/Categories/Categories_Action';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useCheckPermissionByPage } from '../../common/GlobalFunction';

const AddEditCategories = ({ onClose, Data }) => {
    const dispatch = useDispatch();
    const [subInput, setSubInput] = useState("");
    const hasPermissionEdit = useCheckPermissionByPage("Categories", "update");
    const hasPermissionAdd = useCheckPermissionByPage("Categories", "insert");
    const handleAddSub = (e, push) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const value = subInput.trim();
            if (value) {
                push({ name: value });
                setSubInput("");
            }
        }
    };
    const initialValues = {
        categoryid: Data ? Data._id : "",
        name: Data ? Data.name : "",
        subcategories: Data?.subcategories?.length > 0 ? Data.subcategories : [{ name: "" }],
    };
    const CategorySchema = Yup.object().shape({
        name: Yup.string().required("Category name is required"),
    });

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                subcategories: values.subcategories
                    .filter(sub => sub.name && sub.name.trim() !== "")
            };

            const response = await dispatch(categoriesSave(payload));

            if (response?.IsSuccess) {
                toast.success(response?.Message);
                onClose();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <>
            <div className="fixed h-screen inset-0 bg-g1/30 backdrop-blur-sm py-24 px-8 z-50 flex items-center justify-center overflow-y-auto">
                <div className="bg-white w-full max-w-[542px] rounded-xl lg:rounded-2xl 2xl:rounded-[30px] px-5 lg:px-7 xl:px-9 py-3.5 lg:py-5 xl:py-7 mb-auto">
                    <div className="flex items-center justify-between mb-3.5 lg:mb-5">
                        <h2 className="text-g1 text24 font-semibold">{Data ? "Edit" : "Add"} Category</h2>
                        <span className="icon-close text-[24px] text-[#B01212] cursor-pointer" onClick={onClose}></span>
                    </div>
                    <Formik initialValues={initialValues} validationSchema={CategorySchema} onSubmit={handleSubmit}>
                        {({ values }) => (
                            <Form>

                                <div className='space-y-5'>
                                    {/* Category Name */}
                                    <div className='relative'>
                                        <label className="label">Category Name</label>
                                        <Field name="name" className="input w-full" placeholder="Enter category name" />
                                        <ErrorMessage name="name" component="div" className="error -bottom-2" />
                                    </div>
                                    {/* Subcategories */}
                                    <FieldArray name="subcategories">
                                        {({ push, remove }) => (
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">Subcategories</span>
                                                    {((Data && hasPermissionEdit) || (!Data && hasPermissionAdd)) && <button type="button" onClick={() => push({ name: "" })} className="text-primary  font-semibold">+ Add</button>}
                                                </div>

                                                <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                                    {values.subcategories.map((_, index) => (
                                                        <div key={index} className="flex space-x-2">
                                                            <Field name={`subcategories.${index}.name`} placeholder="Subcategory name" className="input" />
                                                            {((Data && hasPermissionEdit) || (!Data && hasPermissionAdd)) && (values.subcategories.length > 1 && (<button type="button" onClick={() => remove(index)} className="text-red font-bold">✕</button>))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                                {((Data && hasPermissionEdit) || (!Data && hasPermissionAdd)) && <div className='w-full max-w-[115px] mx-auto mt-4 lg:mt-6 xl:mt-8'>
                                    <button type="submit" className="btn_primary">Save</button>
                                </div>}
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default AddEditCategories