import React, { useEffect, useState } from 'react'
import { useCheckPermissionByPage } from '../../common/GlobalFunction'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { Status } from '../../common/CommonArray'
import CustomDropdown from '../../components/UI/CustomDropdown'
import CustomTable from '../../components/CustomTable'
import CommonDialog from '../../common/CommonDialog'
import moment from 'moment'
import { InputSwitch } from 'primereact/inputswitch'

const SupportTicket = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [commonData, setCommonData] = useState({});
  const [DeletePopup, setDeletePopup] = useState({ isOpen: false, Data: {}, });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const hasPermissionDelete = useCheckPermissionByPage("Support Ticket", "delete");
  const Data = [
    {
      id: 1,
      name: "Basic",
      price: "$10",
      status: true,
    }
  ]
  const columns = [
    { key: "createdAt", label: "created Date", renderCell: (key, row) => row?.createdAt ? moment.utc(row?.createdAt).format("DD-MM-YYYY") : "-" },

    { key: "name", label: "Name", renderCell: (key, row) => row?.name || "-" },
    { key: "price", label: "Price", renderCell: (key, row) => row?.price || "-" },
    { key: "status", label: "Status", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row.id)} /> },
    {
      key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5">
        <span className="icon-eye text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => navigate(`./details/${row.id}`)}></span>
        {hasPermissionDelete && <span className="icon-trash text-[18px] lg:text-[20px] xl:text-[24px] text-red cursor-pointer" style={{ color: '#FF3B30' }} onClick={() => DeleteOpenDialog(row)}></span>}
      </div>
    }]

  const handleStatusChange = async (id) => {
    try {
      const payload = { id: id }
      // const response = await dispatch(ChangeStatus(payload))
      // if (response.IsSuccess) {
      //     toast.success(response.Message)
      //     GetUserData()
      // }
    }
    catch (error) {
      console.log('error', error)
    }
  }

  const DeleteOpenDialog = (rowData) => {
    setCommonData({
      title: "Delete Plan",
      description: "Are You Sure You Want To Delete Plan? ",
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
        // const response = await dispatch(roleDelete(payload));
        // if (response?.IsSuccess) {
        //     toast.success(response?.Message);
        //     GetPlanData();
        // }
        setDeletePopup({ isOpen: false, resData: {}, });
      }
    } else {
      GetPlanData();
      setDeletePopup(false);
    }
    setDeletePopup(false);
  };

  const GetPlanData = async () => {
    try {
      const payload = { search: search, status: selectedStatus }
      // const response = await dispatch(GetPlan(payload))
      // if (response.IsSuccess) {
      //     setData(response.Data)
      // }
    }
    catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => { GetPlanData() }, [search, selectedStatus])

  return (
    <>
      <Header name="Support Ticket" />
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

          <CustomTable columns={columns} data={Data} isPagination={true} totalRecords={Data?.pagination?.total} handlePageChange={GetPlanData} pagination={pagination} />
        </div>
      </div>

      {DeletePopup.isOpen && <CommonDialog CommonData={commonData} closeCommonDialog={deleteCloseDialog} />}

    </>
  )
}

export default SupportTicket