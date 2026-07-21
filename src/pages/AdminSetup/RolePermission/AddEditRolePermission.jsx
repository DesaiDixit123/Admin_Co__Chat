import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import toast from 'react-hot-toast'
import { toTitleCase, useCheckPermissionByPage } from '../../../common/GlobalFunction'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ROLE_NAME_VALIDATION } from '../../../common/ErrorMessageCommon'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { SelectButton } from 'primereact/selectbutton'
import { roleAllPermission, roleGetOne, roleSave } from '../../../Store/Action/AdminSetup/Role/Role_Action'

const AddEditRolePermission = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const [roleInitialPermission, setRoleInitialPermission] = useState([]);
  const [loading, setLoading] = useState(false)
  const hasPermissionEdit = useCheckPermissionByPage("Role & Permissions", "update");
  const hasPermissionAdd = useCheckPermissionByPage("Role & Permissions", "insert");

  const [initialValues, setInitialValues] = useState({
    roleid: id || "",
    name: "",
    permissions: [],
  });
  const handleValidationSchema = Yup.object({
    name: Yup.string().required(ROLE_NAME_VALIDATION),
  });

  const getPetSelectAll = (values, index) => {
    return (
      values?.permissions?.[index]?.view &&
      values?.permissions?.[index]?.insert &&
      values?.permissions?.[index]?.update &&
      values?.permissions?.[index]?.delete
    );
  };

  const handleSelectAll = (e, setFieldValue, index) => {
    const isChecked = e.target.checked;
    setFieldValue(`permissions[${index}].selectAll`, isChecked);

    // Set all permission fields based on the "Select All" checkbox
    setFieldValue(`permissions[${index}].view`, isChecked);
    setFieldValue(`permissions[${index}].insert`, isChecked);
    setFieldValue(`permissions[${index}].update`, isChecked);
    setFieldValue(`permissions[${index}].delete`, isChecked);
  };

  const selectAllPermissionFun = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    const updatedPermissions = roleInitialPermission.map((_, index) => ({
      selectAll: isChecked,
      view: isChecked,
      insert: isChecked,
      update: isChecked,
      delete: isChecked,
    }));

    setFieldValue("permissions", updatedPermissions);
  }

  const getRolePermissionList = async () => {
    const response = await dispatch(roleAllPermission());
    setRoleInitialPermission(response.Data || []);
  };

  const editFillDetails = async () => {
    if (id) {
      const response = await dispatch(roleGetOne({ rolesid: id, }));
      if (response?.IsSuccess) {
        const roleData = response?.Data;
        // Initialize permissions with the correct structure
        const initializedPermissions = roleInitialPermission.map(
          (permission) => {
            const matchedPermission = roleData.permissions?.find(
              (p) => p.displayname === permission.displayname
            );
            return {
              displayname: permission.displayname || "",
              collectionName: permission.collectionName || "",
              insert: matchedPermission?.insert || false,
              update: matchedPermission?.update || false,
              delete: matchedPermission?.delete || false,
              view: matchedPermission?.view || false,
            };
          }
        );
        setInitialValues({
          roleid: roleData._id || "",
          name: roleData.name || "",
          permissions: initializedPermissions,
        });
      }
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        name: toTitleCase(values?.name),
      };

      const processedPermissions = roleInitialPermission.map(
        (permission, index) => ({
          displayname: permission.displayname || "",
          collectionName: permission.collectionName || "",
          insert: values.permissions[index]?.insert || false,
          update: values.permissions[index]?.update || false,
          delete: values.permissions[index]?.delete || false,
          view: values.permissions[index]?.view || false,
        })
      );

      payload["permissions"] = processedPermissions;

      if (id) {
        payload["roleid"] = id;
      }
      const response = await dispatch(roleSave(payload))
      if (response?.IsSuccess) {
        toast.success(response?.Message);
        navigate("../role-permission");
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false)
  }

  useEffect(() => {
    getRolePermissionList();
  }, []);

  useEffect(() => {
    if (roleInitialPermission.length > 0) {
      editFillDetails();
    }
  }, [id, roleInitialPermission]);

  return (
    <>
      <Header name="Role & Permissions" />
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={handleValidationSchema} enableReinitialize>
        {({ values, setFieldValue }) => (
          <Form>
            <div className="gra p-5 md:p-6 lg:p-7 space-y-5 lg:space-y-7 2xl:space-y-9">
              <div className="flex items-center">
                <div className="flex items-center space-x-3.5 lg:space-x-5">
                  <h6 className="text-18 md:text-20 xl:text-24 text-primary font-semibold">{id ? "Edit" : "Add"} Role</h6>
                </div>
                <div className="ml-auto flex items-center space-x-2.5">
                  <Link to="../role-permission" type='submit' className="btn_secondary">Cancel</Link>
                  {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                </div>
              </div>
              <div className="flex flex-wrap items-start -mx-1.5 xl:-mx-2.5 2xl:-mx-3.5">
                <div className="w-full p-1.5 xl:p-2.5 2xl:p-3.5 relative">
                  <label className="label">Role Name <span className="text-red">*</span></label>
                  <Field type="text" className="input" name="name" placeholder="Enter Name" />
                  <ErrorMessage name='name' component={'span'} className="text-red error" />
                </div>

                {/* Add Role Permission */}
                <div className="bg-white p-1.5 xl:p-2.5 2xl:p-3.5 rounded-lg 2xl:rounded-xl w-full">
                  <div className="flex item-center justify-between">
                    <h5 className="text24 font-semibold text-g1">Assign Permission</h5>
                    <label htmlFor="all_check" className="flex items-center p-2.5 space-x-2 ml-auto cursor-pointer">
                      <input type="checkbox" name="allPermission" checked={(roleInitialPermission.length > 0 && roleInitialPermission.every((_, index) => getPetSelectAll(values, index))) || false} className="form-checkbox" onChange={(e) => selectAllPermissionFun(e, setFieldValue)} />
                      <span className="text-12 lg:text-14 font-semibold text-secondary">Select All</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap -mx-1.5 xl:-mx-2.5 2xl:-mx-3.5">
                    {Array.isArray(roleInitialPermission) && roleInitialPermission.map((items, index) => {
                      return (
                        <div key={index} className="w-full xs:w-1/2 lg:w-1/3 2xl:w-1/4 p-2.5 xl:p-3.5">
                          <div className="p-4 xl:p-5 px-3.5 xl:px-6 border border-l2 rounded-xl 2xl:rounded-2xl">
                            <div className="flex justify-between items-center">
                              <span className="text-12 lg:text-14 font-semibold text-secondary">{items.displayname}</span>
                              <label htmlFor="1" className="flex items-center space-x-2 ml-auto cursor-pointer">
                                <Field type="checkbox" name={`permissions[${index}].selectAll`} className="form-checkbox bg-l4" checked={getPetSelectAll(values, index) || false} onChange={(e) => handleSelectAll(e, setFieldValue, index)} />
                                <span className="text-12 lg:text-14 font-semibold text-secondary">Select All</span>
                              </label>
                            </div>
                            <div className="space-y-3.5 xl:space-y-5 mt-3.5 xl:mt-5">
                              <label htmlFor="2" className="flex items-center space-x-2 ml-auto cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <Field type="checkbox" name={`permissions[${index}].view`} id="all_check" className="form-checkbox bg-l4" />
                                <span className="text-12 lg:text-14 text-secondary">View</span>
                              </label>
                              <label htmlFor="3" className="flex items-center space-x-2 ml-auto cursor-pointer">
                                <Field type="checkbox" name={`permissions[${index}].insert`} id="all_check" className="form-checkbox bg-l4" />
                                <span className="text-12 lg:text-14 text-secondary">Add</span>
                              </label>
                              <label htmlFor="3" className="flex items-center space-x-2 ml-auto cursor-pointer">
                                <Field type="checkbox" name={`permissions[${index}].update`} id="all_check" className="form-checkbox bg-l4" />
                                <span className="text-12 lg:text-14 text-secondary">Update</span>
                              </label>
                              <label htmlFor="4" className="flex items-center space-x-2 ml-auto cursor-pointer">
                                <Field type="checkbox" name={`permissions[${index}].delete`} id="all_check" className="form-checkbox bg-l4" />
                                <span className="text-12 lg:text-14 text-secondary">Delete</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className='w-full flex items-center justify-between py-1.5 xl:py-2.5 2xl:py-3.5 relative'>
                    <div className="ml-auto">
                      {((id && hasPermissionEdit) || (!id && hasPermissionAdd)) && <button type='submit' className="btn_primary min-w-28 md:max-w-[168px] hover:bg-white hover:border-primary" disabled={loading}>{loading ? "Saving..." : "Save"}</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik >
    </>
  )
}

export default AddEditRolePermission