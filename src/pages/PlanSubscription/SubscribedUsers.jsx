import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomTable from '../../components/CustomTable';
import CustomDropdown from '../../components/UI/CustomDropdown';
import { planSubscribers, downloadSubscriberInvoice } from '../../Services/services';
import { createClientInvoicePdfBlob } from '../../utils/invoicePdfCreator';

const StatusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Active Plans', value: 'active' },
  { label: 'Expired Plans', value: 'expired' },
];

const formatPhone = (phone) => {
  if (!phone) return "-";
  let cleaned = String(phone).trim();
  cleaned = cleaned.replace(/^\++/, '+');
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '+91 ' + cleaned;
  }
  return cleaned;
};

const SubscribedUsers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [subscribersData, setSubscribersData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownloadInvoice = async (row) => {
    const targetId = row?._id || row?.subscription?.paymentId;
    if (!targetId && !row?.subscription) {
      toast.error('No invoice identifier found for this subscriber');
      return;
    }

    setDownloadingId(row._id);
    try {
      let blob = null;
      try {
        if (targetId) {
          const res = await downloadSubscriberInvoice(targetId);
          if (res?.data) {
            blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' });
          }
        }
      } catch (apiErr) {
        console.warn('Backend invoice API error, falling back to client-side generator:', apiErr);
      }

      // If backend API returned no blob or was unreachable, generate PDF seamlessly on client
      if (!blob || blob.size === 0) {
        blob = await createClientInvoicePdfBlob(row, 18);
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const userName = (row?.fullname?.trim() || row?.nickname?.trim() || 'Customer').replace(/[^a-zA-Z0-9_-]/g, '_');
      link.setAttribute('download', `ChatNest_Invoice_${userName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Invoice download error:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchSubscribers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      setPagination({ page, limit });
      const payload = {
        page,
        limit,
        search: search || '',
        status: selectedStatus || '',
      };

      const res = await planSubscribers(payload);
      if (res?.data?.IsSuccess && res?.data?.Data) {
        setSubscribersData(res.data.Data.docs || []);
        setTotalRecords(res.data.Data.totalDocs || 0);
      }
    } catch (error) {
      console.error('Fetch Subscribers Error:', error);
      toast.error(error?.message || 'Failed to fetch subscriber list');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    fetchSubscribers(1, pagination.limit);
  }, [fetchSubscribers]);

  const columns = [
    {
      key: 'user',
      label: 'User Details',
      renderCell: (key, row) => {
        const name = row?.fullname?.trim() || row?.nickname?.trim() || 'User';
        const profileImg = row?.profile ? (import.meta.env.VITE_BUCKET_URL + row.profile) : null;

        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-l3 border border-l2 overflow-hidden flex items-center justify-center shrink-0">
              {profileImg ? (
                <img src={profileImg} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="icon-user-fill text-[20px] text-g7"></span>
              )}
            </div>
            <div>
              <p className="font-semibold text-g1 text-13 md:text-14">{name}</p>
              <p className="text-11 text-g6 mt-0.5">{formatPhone(row?.mobile)}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'plan',
      label: 'Subscribed Plan',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        const title = sub.planTitle || 'Plan';
        const funcs = sub.functionalities || [];

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-g1 text-13 md:text-14">{title}</span>
              <span className="bg-primary/10 text-primary text-10 font-bold px-2 py-0.5 rounded-full">
                MEMBERSHIP
              </span>
            </div>
            {funcs.length > 0 && (
              <div className="flex flex-wrap gap-1 text-10 text-g6">
                {funcs.slice(0, 3).map((f, i) => (
                  <span key={i} className="bg-l3 px-1.5 py-0.5 rounded">
                    {f?.functionalityId?.name || f?.name || 'Feature'}
                  </span>
                ))}
                {funcs.length > 3 && (
                  <span className="text-g5 font-medium">+{funcs.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'duration',
      label: 'Duration',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        return (
          <div>
            <span className="font-semibold text-g1 text-13">
              {sub.durationLabel || `${sub.durationDays || 30} Days`}
            </span>
            <p className="text-11 text-g6 mt-0.5">({sub.durationDays || 30} Days Validity)</p>
          </div>
        );
      },
    },
    {
      key: 'price',
      label: 'Amount Paid',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        return (
          <div className="font-bold text-14 text-g1">
            ₹{Number(sub.price || 0).toFixed(2)}
          </div>
        );
      },
    },
    {
      key: 'startDate',
      label: 'Purchased On (Start Date & Time)',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        const date = sub.startDate || sub.activatedAt || row?.createdAt;
        if (!date) return '-';

        return (
          <div>
            <p className="font-semibold text-g1 text-12 md:text-13">
              {moment(date).format('DD-MM-YYYY')}
            </p>
            <p className="text-11 text-g6 font-medium">
              at {moment(date).format('hh:mm A')}
            </p>
          </div>
        );
      },
    },
    {
      key: 'expiryDate',
      label: 'Expiry On (End Date & Time)',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        if (!sub.expiryDate) return '-';

        const isExpired = sub.isExpired ?? (new Date(sub.expiryDate).getTime() <= Date.now());
        const remainingDays = sub.remainingDays ?? 0;

        return (
          <div>
            <p className="font-semibold text-g1 text-12 md:text-13">
              {moment(sub.expiryDate).format('DD-MM-YYYY')}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-11 text-g6">at {moment(sub.expiryDate).format('hh:mm A')}</span>
              <span
                className={`text-10 font-bold px-1.5 py-0.2 rounded ${
                  isExpired
                    ? 'bg-red/10 text-red'
                    : 'bg-green/10 text-green'
                }`}
              >
                {isExpired ? 'Expired' : `${remainingDays}d Left`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      renderCell: (key, row) => {
        const sub = row?.subscription || {};
        const isExpired = sub.isExpired ?? (new Date(sub.expiryDate).getTime() <= Date.now());

        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-11 font-bold ${
              isExpired
                ? 'bg-red/10 text-red border border-red/20'
                : 'bg-green/10 text-green border border-green/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isExpired ? 'bg-red' : 'bg-green animate-pulse'
              }`}
            ></span>
            <span>{isExpired ? 'Expired' : 'Active'}</span>
          </span>
        );
      },
    },
    {
      key: 'invoice',
      label: 'Invoice',
      renderCell: (key, row) => {
        const isDownloading = downloadingId === row._id;
        return (
          <button
            type="button"
            onClick={() => handleDownloadInvoice(row)}
            disabled={isDownloading}
            title="Download Official Tax Invoice"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-12 font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 hover:border-primary shadow-xs group"
          >
            {isDownloading ? (
              <>
                <span className="icon-swap animate-spin text-13"></span>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download</span>
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <>
      <Header name="Plan & Subscription" />

      <div className="p-4 md:p-6 lg:p-7 space-y-5 lg:space-y-6 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] overflow-y-auto bg-l4/60">
        <div className="max-w-7xl mx-auto space-y-5">

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-l2 pb-2">
            <button
              type="button"
              onClick={() => navigate('/plans-subscription')}
              className="px-4 py-2 rounded-xl text-13 md:text-14 font-semibold text-g5 hover:text-g1 hover:bg-white transition"
            >
              All Plans
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-13 md:text-14 font-bold bg-white text-primary shadow-sm border border-l2"
            >
              Subscribed Users ({totalRecords})
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 md:p-4 rounded-xl lg:rounded-2xl border border-l2 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
              {/* Search Box */}
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user, mobile, plan..."
                  className="input pl-9 text-13"
                />
                <span className="icon-search absolute left-3 top-1/2 -translate-y-1/2 text-g6 text-14"></span>
              </div>

              {/* Status Filter */}
              <div className="w-44">
                <CustomDropdown
                  value={selectedStatus}
                  options={StatusOptions}
                  placeholder="Filter Status"
                  onChange={(val) => setSelectedStatus(val)}
                  className="input_sub bg-white text-13"
                />
              </div>
            </div>

            <div className="text-12 text-g6">
              Total Subscriptions: <strong className="text-g1 font-bold">{totalRecords}</strong>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl lg:rounded-2xl border border-l2 p-4 shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-g6 text-14">
                <span className="icon-swap animate-spin mr-2"></span> Loading subscribed users...
              </div>
            ) : subscribersData.length === 0 ? (
              <div className="p-12 text-center text-g6">
                <span className="icon-user-fill text-36 text-g7 block mb-2"></span>
                <p className="font-semibold text-15 text-g1">No Subscribed Users Found</p>
                <p className="text-12 text-g6 mt-1">Users who activate a membership plan will appear here with complete purchase and expiry timestamps.</p>
              </div>
            ) : (
              <CustomTable
                columns={columns}
                data={subscribersData}
                isPagination={true}
                totalRecords={totalRecords}
                handlePageChange={(newPage, newLimit) => fetchSubscribers(newPage, newLimit)}
                pagination={pagination}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscribedUsers;
