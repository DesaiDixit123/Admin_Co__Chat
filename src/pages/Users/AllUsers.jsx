import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import CustomTable from '../../components/CustomTable';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { InputSwitch } from 'primereact/inputswitch';
import { useDispatch } from 'react-redux';
import { usersChangeStatus, usersDelete, usersListWithPagination } from '../../Store/Action/Users/User_Action';
import { useUserList } from '../../Store/Selectors/Users/Users_Selector';
import { Status } from '../../common/CommonArray';
import CustomDropdown from '../../components/UI/CustomDropdown';
import CommonDialog from '../../common/CommonDialog';
import { assets } from '../../assets/images/assets';
import toast from 'react-hot-toast';

const AllUsers = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [deletePopup, setDeletePopup] = useState({ isOpen: false, data: null })
  const [commonData, setCommonData] = useState({})
  const dispatch = useDispatch()
  const Data = useUserList()

  const formatPhone = (countryCode, mobile) => {
    if (!mobile) return "-";
    let code = (countryCode || "+91").toString().trim();
    if (!code.startsWith("+")) code = `+${code}`;
    return `${code} ${mobile}`;
  };

  const columns = [
    { key: "registerDate", label: "Register Date", renderCell: (key, row) => row?.createdAt ? moment.utc(row?.createdAt).format("DD-MM-YYYY") : "-" },
    {
      key: "name", label: "Full Name", renderCell: (key, row) => (<div className="flex items-center space-x-2.5">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-l3 shrink-0 flex items-center justify-center">
          <img src={row?.profileimage ? `${import.meta.env.VITE_BUCKET_URL}${row?.profileimage}` : assets.userDefaultImg} className="w-full h-full object-cover" alt="profile" />
        </div>
        <span>{row?.fullname?.trim() || row?.nickname?.trim() || (row?.mobile ? `User (${formatPhone(row?.country_code, row?.mobile)})` : '-')}</span>
      </div>)
    },
    { key: "mobile", label: "Mobile No.", renderCell: (key, row) => formatPhone(row?.country_code, row?.mobile) },
    { key: "email", label: "Email", renderCell: (key, row) => row?.email || "-" },
    { key: "dob", label: "Date of Birth", renderCell: (key, row) => row?.dob || "-" },
    { key: "gender", label: "Gender", renderCell: (key, row) => row?.gender || "-" },
    { key: "status", label: "Status", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row.id || row._id)} /> },
    {
      key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5">
        <span className="icon-eye text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => navigate(`./details/${row.id || row._id}`)}></span>
        <span
          title="Delete User"
          className="icon-trash text-[18px] lg:text-[20px] xl:text-[22px] text-red-500 hover:brightness-75 cursor-pointer transition"
          onClick={() => openDeleteDialog(row)}
        ></span>
      </div>
    }
  ]

  const handleStatusChange = async (id) => {
    try {
      const payload = { userId: id }
      const response = await dispatch(usersChangeStatus(payload))
      if (response?.IsSuccess) {
        toast.success(response?.Message)
        GetUserData()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const openDeleteDialog = (row) => {
    const name = row?.fullname?.trim() || row?.nickname?.trim() || row?.mobile || "this user"
    setCommonData({
      title: "Delete User Account",
      description: `Are you sure you want to permanently delete "${name}"? Their account will be removed and they can re-register with the same mobile number.`,
      buttonNames: { firstBtn: "Cancel", secondBtn: "Delete" },
    })
    setDeletePopup({ isOpen: true, data: row })
  }

  const closeDeleteDialog = async (confirm) => {
    if (confirm === true && deletePopup.data) {
      try {
        const userId = deletePopup.data._id || deletePopup.data.id
        const response = await dispatch(usersDelete({ userId }))
        if (response?.IsSuccess) {
          toast.success(response?.Message || "User deleted successfully")
          GetUserData(pagination.page, pagination.limit)
        } else {
          toast.error(response?.Message || "Failed to delete user")
        }
      } catch (error) {
        console.log('error', error)
        toast.error("Something went wrong")
      }
    }
    setDeletePopup({ isOpen: false, data: null })
  }

  const GetUserData = async (page = 1, limit = 10) => {
    try {
      setPagination({ page, limit });
      const payload = {
        page,
        limit,
        search: search || "",
        status: selectedStatus == 'true' ? true : selectedStatus == 'false' ? false : ""
      }

      await dispatch(usersListWithPagination(payload))
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => { GetUserData() }, [search])


  return (
    <>
      <Header name="Users" />
      <div className="p-5 md:p-6 lg:p-7 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)]">
        <div className="flex flex-col h-full">
          <div className="flex flex-wrap justify-between sm:flex-nowrap items-center -mx-2">
            <div className="w-full xs:w-auto flex flex-wrap">
              <div className="w-full xs:w-auto py-1 md:py-2 p-2">
                <label htmlFor="search" className="input_sub flex items-center space-x-2">
                  <span className="icon-search"></span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Serach" id="search" />
                </label>
              </div>
              <div className="w-full xs:w-1/2 md:w-1/3 2xl:w-[224px] py-1 md:py-2 p-2">
                <CustomDropdown value={selectedStatus} options={Status} placeholder="Select Status" onChange={(val) => { setSelectedStatus(val) }} className='input_sub' />
              </div>
            </div>
          </div>

          <CustomTable columns={columns} data={Data?.data} isPagination={true} totalRecords={Data?.pagination?.total} handlePageChange={GetUserData} pagination={pagination} />
        </div>
      </div>
      {deletePopup.isOpen && (
        <CommonDialog CommonData={commonData} closeCommonDialog={closeDeleteDialog} />
      )}
    </>
  )
}

export default AllUsers