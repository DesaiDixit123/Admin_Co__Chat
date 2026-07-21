import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom';
import CustomTable from '../../../components/CustomTable';
import { InputSwitch } from 'primereact/inputswitch';
import { Status } from '../../../common/CommonArray';
import CustomDropdown from '../../../components/UI/CustomDropdown';
import { adminChangeStatus, adminListWithPagination } from '../../../Store/Action/AdminSetup/Admin/Admin_Action';
import { useAdminList } from '../../../Store/Selectors/AdminSetup/Admin/Admin_Selector';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useCheckPermissionByPage } from '../../../common/GlobalFunction';

const AllAdmin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const AdminData = useAdminList()
  const hasPermissionAdd = useCheckPermissionByPage("Admins", "insert");

  const handleStatusChange = async (id) => {
    try {
      const payload = { adminuserid: id }
      const response = await dispatch(adminChangeStatus(payload))
      if (response.IsSuccess) {
        toast.success(response.Message)
        GetAdminList()
      }
    }
    catch (error) {
      console.log('error', error)
    }

  }

  const Columns = [
    { key: "name", label: "Name", renderCell: (key, row) => row?.name || "-" },
    { key: "mobile", label: "Mobile No.", renderCell: (key, row) => `${row?.country_code} ${row?.mobile}` },
    { key: "email", label: "Email", renderCell: (key, row) => row?.email },
    { key: "roleName", label: "RoleName", renderCell: (key, row) => row?.roleid?.name },
    { key: "status", label: "On/Off", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row.id)} /> },
    { key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5"><span className="icon-edit font-bold text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => navigate(`./edit/${row.id}`)}></span></div> }
  ]


  const GetAdminList = async (page = 1, limit = 10) => {
    try {
      setPagination({ page, limit })
      const payload = {
        page,
        limit,
        search: searchText || "",
        status: selectedStatus == 'true' ? true : selectedStatus == 'false' ? false : ""
      }

      await dispatch(adminListWithPagination(payload))
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => { GetAdminList() }, [selectedStatus, searchText])


  return (
    <>
      <Header name="Admins" />
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
                <span>Add Admin</span>
              </button>
            </div>}
          </div>
          <CustomTable columns={Columns} data={AdminData?.Data?.docs} isPagination={true} totalRecords={AdminData?.Data?.totalDocs} handlePageChange={GetAdminList} pagination={pagination} />
        </div>
      </div>
    </>
  )
}

export default AllAdmin