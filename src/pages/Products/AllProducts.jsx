import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import CustomTable from '../../components/CustomTable';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { InputSwitch } from 'primereact/inputswitch';
import { useDispatch } from 'react-redux';
import { useProductList } from '../../Store/Selectors/Product/Product_Selector';
import { productsChangeStatus, productsListWithPagination, productsDelete } from '../../Store/Action/Product/Product_Action';
import { Status } from '../../common/CommonArray';
import CustomDropdown from '../../components/UI/CustomDropdown';
import CommonDialog from '../../common/CommonDialog';
import toast from 'react-hot-toast';

const AllProducts = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 10 })
    const [commonData, setCommonData] = useState({});
    const [deletePopup, setDeletePopup] = useState({ isOpen: false, data: {} });
    const dispatch = useDispatch()
    const Data = useProductList()

    const columns = [
        { key: 'name', label: 'Name', renderCell: (key, row) => row?.name || "-" },
        { key: 'price', label: 'Price', renderCell: (key, row) => row?.price || "-" },
        { key: 'offer', label: 'Offer', renderCell: (key, row) => row?.offer ? `${row?.offer}${row?.offer_type == "percentage" ? "%" : "₹"}` : "-" },
        { key: "createdAt", label: "Created Date", renderCell: (key, row) => row?.createdAt ? moment(row?.createdAt).format("DD/MM/YYYY") : "-" },
        { key: "status", label: "On/Off", renderCell: (key, row) => <InputSwitch checked={row?.status} onChange={() => handleStatusChange(row._id || row.id)} /> },
        {
            key: "action", label: "Action", renderCell: (key, row) => <div className="flex items-center space-x-2.5">
                <span title="View Details" className="icon-eye font-semibold text-[18px] lg:text-[20px] xl:text-[24px] text-g1 cursor-pointer" onClick={() => navigate(`./details/${row._id}`)}></span>
                <span title="Delete Product" className="icon-trash font-semibold text-[18px] lg:text-[20px] xl:text-[24px] cursor-pointer" style={{ color: '#FF3B30' }} onClick={() => openDeleteDialog(row)}></span>
            </div>
        },
    ]

    const openDeleteDialog = (row) => {
        setCommonData({
            title: "Delete Product",
            description: `Are you sure you want to delete "${row.name || 'this product'}"? This product will be permanently removed from the marketplace and database.`,
            buttonNames: { firstBtn: "Cancel", secondBtn: "Delete" },
        });
        setDeletePopup({
            isOpen: true,
            data: row,
        });
    };

    const closeDeleteDialog = async (confirmed) => {
        if (confirmed && (deletePopup?.data?._id || deletePopup?.data?.id)) {
            try {
                const pId = deletePopup.data._id || deletePopup.data.id;
                const payload = { productId: pId };
                const response = await dispatch(productsDelete(payload));
                if (response?.IsSuccess) {
                    toast.success(response?.Message || "Product deleted successfully");
                    GetProductData(pagination.page, pagination.limit);
                } else {
                    toast.error(response?.Message || "Failed to delete product");
                }
            } catch (error) {
                console.error("Delete product error:", error);
                toast.error("Failed to delete product");
            }
        }
        setDeletePopup({ isOpen: false, data: {} });
    };

    const handleStatusChange = async (id) => {
        try {
            const payload = { productId: id }
            const response = await dispatch(productsChangeStatus(payload))
            if (response?.IsSuccess) {
                toast.success(response?.Message)
                GetProductData()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const GetProductData = async (page = 1, limit = 10) => {
        try {
            setPagination({ page, limit });
            const payload = {
                page,
                limit,
                search: search || "",
                status: selectedStatus == 'true' ? true : selectedStatus == 'false' ? false : ""
            }

            await dispatch(productsListWithPagination(payload))
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => { GetProductData() }, [search])


    return (
        <>
            <Header name="Products" />
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

                    <CustomTable columns={columns} data={Data?.data} isPagination={true} totalRecords={Data?.pagination?.total} handlePageChange={GetProductData} pagination={pagination} />
                </div>
            </div>
            {deletePopup.isOpen && <CommonDialog CommonData={commonData} closeCommonDialog={closeDeleteDialog} />}
        </>
    )
}

export default AllProducts