import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Status } from '../../../common/CommonArray'
import CustomDropdown from '../../../components/UI/CustomDropdown'
import CustomTable from '../../../components/CustomTable'
import moment from 'moment'
import { InputSwitch } from 'primereact/inputswitch'
import { roleChangeStatus, roleDelete, roleListWithPagination } from '../../../Store/Action/AdminSetup/Role/Role_Action'
import { useRoleList } from '../../../Store/Selectors/AdminSetup/Role/Role_Selector'
import CommonDialog from '../../../common/CommonDialog'
import { useCheckPermissionByPage } from '../../../common/GlobalFunction'

const AllRolePermission = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [commonData, setCommonData] = useState({});
  const [DeletePopup, setDeletePopup] = useState({ isOpen: false, Data: {}, });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const roleData = useRoleList()
  const hasPermissionAdd = useCheckPermissionByPage("Role & Permissions", "insert");
  const hasPermissionDelete = useCheckPermissionByPage("Role & Permissions", "delete");
  const handleStatusChange = async (id) => {
    try {
      const payload = { rolesid: id }
      const response = await dispatch(roleChangeStatus(payload))
      if (response.IsSuccess) {
        toast.success(response.Message)
        GetRolePermission()
      }
    } catch (error) {
      console.log('error', error)
    }

  }

  const Columns = [
    { key: "roleName", label: "RoleName", renderCell: (key, row) => row?.name },
    { key: "createdAt", label: "Created Date", renderCell: (key, row) => row?.createdAt ? moment(row?.createdAt).format("DD/MM/YYYY") : "-" },
    { key: "status", label: "Status", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row.id)} /> },
    {
      key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5">
        <span className="icon-edit font-bold text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => navigate(`./edit/${row.id}`)}></span>
        {hasPermissionDelete && <span className="icon-trash text-[18px] lg:text-[20px] xl:text-[24px] text-red cursor-pointer" onClick={() => DeleteOpenDialog(row)}></span>}
      </div>
    }
  ]

  const DeleteOpenDialog = (rowData) => {
    setCommonData({
      title: "Delete Role",
      description: "Are You Sure You Want To Delete Role? ",
      buttonNames: { firstBtn: "Cancel", secondBtn: "Delete" },
    });
    setDeletePopup({
      isOpen: true,
      resData: { rowData },
    });
  };
  const deleteCloseDialog = async (closeEvent) => {
    if (closeEvent) {
      if (DeletePopup?.resData) {
        let resData = DeletePopup?.resData;
        const payload = { rolesid: resData?.rowData?._id || "", };
        const response = await dispatch(roleDelete(payload));
        if (response?.IsSuccess) {
          toast.success(response?.Message);
          GetRolePermission();
        }
        setDeletePopup({ isOpen: false, resData: {}, });
      }
    } else {
      GetRolePermission();
      setDeletePopup(false);
    }
    setDeletePopup(false);
  };

  const GetRolePermission = async (page = 1, limit = 10) => {
    try {
      setPagination({ page, limit })
      const payload = {
        page: page,
        limit: limit,
        search: searchText || "",
        status: selectedStatus == 'true' ? true : selectedStatus == 'false' ? false : ""
      }
      await dispatch(roleListWithPagination(payload))
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => { GetRolePermission() }, [searchText, selectedStatus])

  return (
    <>
      <Header name="Role & Permissions" />
      <div className="p-5 md:p-6 lg:p-7 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)]">
        <div className="flex flex-col h-full">
          <div className="flex flex-wrap justify-between sm:flex-nowrap items-center -mx-2">
            <div className="w-full xs:w-auto flex flex-wrap">
              <div className="w-full xs:w-auto py-1 md:py-2 p-2">
                <label htmlFor="search" className="input_sub flex items-center space-x-2">
                  <span className="icon-search"></span>
                  <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Serach" id="search" />
                </label>
              </div>
              <div className="w-full xs:w-1/2 md:w-1/3 2xl:w-[224px] py-1 md:py-2 p-2">
                <CustomDropdown value={selectedStatus} options={Status} placeholder="Select Status" onChange={(val) => { setSelectedStatus(val) }} className='input_sub' />
              </div>
            </div>
            {hasPermissionAdd && <div className="w-full xs:w-auto py-1 md:py-2 p-2">
              <button type="button" onClick={() => navigate('./create')} className={`btn_primary flex justify-center items-center space-x-1 w-full xs:w-auto `}>
                <span className="icon-add text-[16px] 2xl:text-[20px] font-extrabold"></span>
                <span>Add Role</span>
              </button>
            </div>}
          </div>

          <CustomTable columns={Columns} data={roleData?.Data?.docs} isPagination={true} totalRecords={roleData?.Data?.totalDocs} handlePageChange={GetRolePermission} pagination={pagination} />
        </div>
      </div>


      {DeletePopup.isOpen && <CommonDialog CommonData={commonData} closeCommonDialog={deleteCloseDialog} />}

    </>
  )
}

export default AllRolePermission