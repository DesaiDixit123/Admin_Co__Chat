import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import { Status } from '../../common/CommonArray';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomTable from '../../components/CustomTable';
import CustomDropdown from '../../components/UI/CustomDropdown';
import CommonDialog from '../../common/CommonDialog';
import { InputSwitch } from 'primereact/inputswitch';
import {
  planListWithPagination,
  planChangeStatus,
  planDelete,
} from '../../Services/services';

const AllPlanSubscription = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [commonData, setCommonData] = useState({});
  const [deletePopup, setDeletePopup] = useState({ isOpen: false, data: {} });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [plansData, setPlansData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPlanData = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      setPagination({ page, limit });
      const payload = {
        page,
        limit,
        search: search || '',
        status: selectedStatus === 'true' ? true : selectedStatus === 'false' ? false : '',
      };

      const res = await planListWithPagination(payload);
      if (res?.data?.IsSuccess && res?.data?.Data) {
        setPlansData(res.data.Data.docs || []);
        setTotalRecords(res.data.Data.totalDocs || 0);
      }
    } catch (error) {
      console.error("Fetch Plans Error:", error);
      toast.error(error?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    fetchPlanData(1, pagination.limit);
  }, [fetchPlanData]);

  const handleStatusChange = async (planId) => {
    try {
      const res = await planChangeStatus({ planId });
      if (res?.data?.IsSuccess) {
        toast.success(res.data.Message || "Plan status updated");
        fetchPlanData(pagination.page, pagination.limit);
      } else {
        toast.error(res?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status Change Error:", error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  const openDeleteDialog = (row) => {
    setCommonData({
      title: "Delete Plan Subscription",
      description: `Are you sure you want to delete "${row.title}" plan? This action cannot be undone.`,
      buttonNames: { firstBtn: "Cancel", secondBtn: "Delete" },
    });
    setDeletePopup({
      isOpen: true,
      data: row,
    });
  };

  const closeDeleteDialog = async (confirmed) => {
    if (confirmed && deletePopup?.data?._id) {
      try {
        const res = await planDelete({ planId: deletePopup.data._id });
        if (res?.data?.IsSuccess) {
          toast.success(res.data.Message || "Plan deleted successfully");
          fetchPlanData(pagination.page, pagination.limit);
        } else {
          toast.error(res?.data?.message || "Failed to delete plan");
        }
      } catch (err) {
        console.error("Delete Error:", err);
        toast.error(err?.message || "Failed to delete plan");
      }
    }
    setDeletePopup({ isOpen: false, data: {} });
  };

  const columns = [
    {
      key: "createdAt",
      label: "Created Date",
      renderCell: (key, row) =>
        row?.createdAt ? moment.utc(row?.createdAt).format("DD-MM-YYYY") : "-",
    },
    {
      key: "title",
      label: "Plan Name",
      renderCell: (key, row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-g1">{row?.title || "-"}</span>
          </div>
          {row?.description && (
            <p className="text-11 text-g6 line-clamp-1 max-w-xs">
              {row.description.replace(/<[^>]+>/g, '')}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Duration Pricing",
      renderCell: (key, row) => {
        const p = row?.pricing || {};
        if (p.durationOptions && Array.isArray(p.durationOptions) && p.durationOptions.length > 0) {
          return (
            <div className="flex flex-wrap gap-1.5 text-11">
              {p.durationOptions.map((opt, idx) => (
                <span key={idx} className="bg-l3 text-g1 px-2 py-0.5 rounded border border-l2">
                  {opt.days} Days: <strong>₹{opt.price}</strong>
                </span>
              ))}
            </div>
          );
        }

        const p1 = p.oneMonthPrice ?? p.monthlyPrice ?? 0;
        const p3 = p.threeMonthPrice ?? 0;
        const p6 = p.sixMonthPrice ?? 0;
        const p12 = p.twelveMonthPrice ?? p.yearlyPrice ?? 0;

        return (
          <div className="flex flex-wrap gap-1.5 text-11">
            <span className="bg-l3 text-g1 px-2 py-0.5 rounded border border-l2">
              30 Days: <strong>₹{p1}</strong>
            </span>
            {p3 > 0 && (
              <span className="bg-l3 text-g1 px-2 py-0.5 rounded border border-l2">
                90 Days: <strong>₹{p3}</strong>
              </span>
            )}
            {p6 > 0 && (
              <span className="bg-l3 text-g1 px-2 py-0.5 rounded border border-l2">
                180 Days: <strong>₹{p6}</strong>
              </span>
            )}
            <span className="bg-l3 text-g1 px-2 py-0.5 rounded border border-l2">
              365 Days: <strong>₹{p12}</strong>
            </span>
          </div>
        );
      },
    },
    {
      key: "functionalities",
      label: "Included Features",
      renderCell: (key, row) => {
        const funcs = (row?.functionalities || []).map((f) => {
          const funcObj = f.functionalityId;
          return typeof funcObj === 'object' && funcObj?.name ? funcObj.name : funcObj;
        });

        return (
          <div className="flex flex-wrap gap-1 max-w-sm">
            {funcs.length > 0 ? (
              funcs.map((name, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="text-g6 text-11">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      renderCell: (key, row) => (
        <InputSwitch
          checked={row?.status}
          onChange={() => handleStatusChange(row._id || row.id)}
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      renderCell: (key, row) => (
        <div className="flex items-center space-x-2.5">
          <span
            title="Edit Plan"
            className="icon-edit text-[18px] text-g1 hover:text-primary cursor-pointer transition"
            onClick={() => navigate(`./edit/${row._id || row.id}`)}
          ></span>
          <span
            title="Delete Plan"
            className="icon-trash text-[18px] text-red hover:brightness-75 cursor-pointer transition"
            style={{ color: '#FF3B30' }}
            onClick={() => openDeleteDialog(row)}
          ></span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header name="Plan & Subscription" />

      <div className="p-5 md:p-6 lg:p-7 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] overflow-y-auto bg-l4/60">
        <div className="flex flex-col h-full space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-l2 pb-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-13 md:text-14 font-bold bg-white text-primary shadow-sm border border-l2"
            >
              All Plans ({totalRecords})
            </button>
            <button
              type="button"
              onClick={() => navigate('/plans-subscription/subscribers')}
              className="px-4 py-2 rounded-xl text-13 md:text-14 font-semibold text-g5 hover:text-g1 hover:bg-white transition"
            >
              Subscribed Users
            </button>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap justify-between sm:flex-nowrap items-center -mx-2">
            <div className="w-full xs:w-auto flex flex-wrap">
              <div className="w-full xs:w-auto py-1 md:py-2 p-2">
                <label htmlFor="search" className="input_sub flex items-center space-x-2 bg-white">
                  <span className="icon-search"></span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search plan..."
                    id="search"
                  />
                </label>
              </div>
              <div className="w-full xs:w-1/2 md:w-1/3 2xl:w-[224px] py-1 md:py-2 p-2">
                <CustomDropdown
                  value={selectedStatus}
                  options={Status}
                  placeholder="Select Status"
                  onChange={(val) => setSelectedStatus(val)}
                  className="input_sub bg-white"
                />
              </div>
            </div>

            <div className="w-full xs:w-auto py-1 md:py-2 p-2">
              <button
                type="button"
                onClick={() => navigate('./create')}
                className="btn_primary flex justify-center items-center space-x-1.5 w-full xs:w-auto cursor-pointer"
              >
                <span className="icon-add text-[16px] 2xl:text-[20px]"></span>
                <span>Add Plan Subscription</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl lg:rounded-2xl border border-l2 p-4 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-g6 text-14">
                <span className="icon-swap animate-spin mr-2"></span> Loading subscription plans...
              </div>
            ) : (
              <CustomTable
                columns={columns}
                data={plansData}
                isPagination={true}
                totalRecords={totalRecords}
                handlePageChange={(newPage, newLimit) => fetchPlanData(newPage, newLimit)}
                pagination={pagination}
              />
            )}
          </div>
        </div>
      </div>

      {deletePopup.isOpen && (
        <CommonDialog CommonData={commonData} closeCommonDialog={closeDeleteDialog} />
      )}
    </>
  );
};

export default AllPlanSubscription;