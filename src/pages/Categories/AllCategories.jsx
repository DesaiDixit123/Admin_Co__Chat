import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import Header from '../../components/Header';
import { InputSwitch } from 'primereact/inputswitch';
import AddEditCategories from './AddEditCategories';
import { Status } from '../../common/CommonArray';
import moment from 'moment';
import CustomDropdown from '../../components/UI/CustomDropdown';
import { useDispatch } from 'react-redux';
import { useCategoriesList } from '../../Store/Selectors/Categories/Categories_Selector';
import { categoriesChangeStatus, categoriesDelete, categoriesListWithPagination } from '../../Store/Action/Categories/Categories_Action';
import toast from 'react-hot-toast';
import CommonDialog from '../../common/CommonDialog';
import { useCheckPermissionByPage } from '../../common/GlobalFunction';

const AllCategories = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState("")
    const [commonData, setCommonData] = useState({});
    const [DeletePopup, setDeletePopup] = useState({ isOpen: false, Data: {}, });
    const [addEditCategories, setAddEditCategories] = useState({ isOpen: false, Data: "" })
    const [pagination, setPagination] = useState({ page: 1, limit: 10 })
    const categoriesData = useCategoriesList()
    const hasPermissionAdd = useCheckPermissionByPage("Categories", "insert");
    const hasPermissionDelete = useCheckPermissionByPage("Categories", "delete");

    const columns = [
        { key: 'name', label: 'Name', renderCell: (key, row) => row?.name || "-" },
        { key: "createdAt", label: "Created Date", renderCell: (key, row) => row?.createdAt ? moment(row?.createdAt).format("DD/MM/YYYY") : "-" },
        { key: "status", label: "On/Off", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row.id)} /> },
        {
            key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5">
                <span className="icon-edit font-bold text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => setAddEditCategories({ isOpen: true, Data: row })}></span>
                {hasPermissionDelete && <span className="icon-trash text-[18px] lg:text-[20px] xl:text-[24px] text-red cursor-pointer" onClick={() => DeleteOpenDialog(row)}></span>}
            </div>
        },
    ]

    const handleCloseCategories = () => {
        setAddEditCategories({ isOpen: false, Data: "" })
        GetCategoriesList()
    }
    const handleStatusChange = async (id) => {
        const payload = { categoryid: id }
        const response = await dispatch(categoriesChangeStatus(payload))
        if (response.IsSuccess) {
            toast.success(response.Message)
            GetCategoriesList()
        }
    }
    const DeleteOpenDialog = (rowData) => {
        setCommonData({
            title: "Delete Category",
            description: "Are You Sure You Want To Delete Category? ",
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
                const payload = { categoryid: resData?.rowData?._id || "", };
                const response = await dispatch(categoriesDelete(payload));
                if (response?.IsSuccess) {
                    toast.success(response?.Message);
                    GetCategoriesList();
                }
                setDeletePopup({ isOpen: false, resData: {}, });
            }
        } else {
            GetCategoriesList();
            setDeletePopup(false);
        }
        setDeletePopup(false);
    };

    const GetCategoriesList = async (page = 1, limit = 10) => {
        try {
            setPagination({ page, limit })
            const payload = {
                page: page,
                limit: limit,
                search: search || "",
                status: selectedStatus == 'true' ? true : selectedStatus == 'false' ? false : ""
            }
            await dispatch(categoriesListWithPagination(payload))
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => { GetCategoriesList() }, [search, selectedStatus])


    return (
        <>
            <Header name="Categories" />
            <div className="p-5 md:p-6 lg:p-7 h-[calc(100vh-61px)] md:h-[calc(100vh-77px)]">
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
                        {hasPermissionAdd && <div className="w-full xs:w-auto py-1 md:py-2 p-2">
                            <button type="button" onClick={() => setAddEditCategories({ isOpen: true, Data: "" })} className={`btn_primary flex justify-center items-center space-x-1 w-full xs:w-auto `}>
                                <span className="icon-add text-[16px] 2xl:text-[20px] font-extrabold"></span>
                                <span>Add Category</span>
                            </button>
                        </div>}
                    </div>

                    <CustomTable columns={columns} data={categoriesData?.Data?.docs || []} isPagination={true} totalRecords={categoriesData?.Data?.totalDocs} handlePageChange={GetCategoriesList} pagination={pagination} />
                </div>
            </div>

            {addEditCategories.isOpen && <AddEditCategories onClose={handleCloseCategories} Data={addEditCategories.Data} />}
            {DeletePopup.isOpen && <CommonDialog CommonData={commonData} closeCommonDialog={deleteCloseDialog} />}

        </>
    )
}

export default AllCategories