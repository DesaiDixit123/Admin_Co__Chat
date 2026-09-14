import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { notificationListWithPagination, notificationMarkRead, notificationClearAll } from '../../Services/services';
import CommonDialog from '../../common/CommonDialog';
import moment from 'moment';
import toast from 'react-hot-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, totalDocs: 0, totalPages: 1, unreadCount: 0 });
  const [clearDialog, setClearDialog] = useState(false);

  const fetchNotifications = async (page = 1, type = activeTab) => {
    try {
      setLoading(true);
      const payload = {
        page,
        limit: pagination.limit,
      };

      if (type === 'unread') {
        payload.unreadOnly = true;
      } else if (type !== 'all') {
        payload.type = type;
      }

      const res = await notificationListWithPagination(payload);
      if (res?.data?.IsSuccess && res?.data?.Data) {
        const docs = (res.data.Data.docs || []).filter(d => d.type !== 'ticket');
        setNotifications(docs);
        setPagination(prev => ({
          ...prev,
          page: res.data.Data.page || 1,
          totalDocs: docs.length,
          totalPages: res.data.Data.totalPages || 1,
          unreadCount: res.data.Data.unreadCount || 0
        }));
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, activeTab);
  }, [activeTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationMarkRead({ all: true });
      toast.success('All notifications marked as read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setPagination(prev => ({ ...prev, unreadCount: 0 }));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleMarkSingleRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await notificationMarkRead({ notificationId: id });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setPagination(prev => ({ ...prev, unreadCount: Math.max(0, prev.unreadCount - 1) }));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationClearAll({});
      toast.success('All notifications cleared');
      setNotifications([]);
      setPagination(prev => ({ ...prev, totalDocs: 0, totalPages: 1, unreadCount: 0 }));
      setClearDialog(false);
    } catch (err) {
      console.error('Error clearing:', err);
    }
  };

  const handleItemClick = async (item) => {
    if (!item.isRead) {
      await handleMarkSingleRead(item._id);
    }
    if (item.link) {
      navigate(item.link);
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'subscription':
        return { label: 'Subscription', bg: 'bg-purple-100 text-purple-800 border-purple-300', iconBg: 'bg-purple-50 text-purple-600', icon: '👑' };
      case 'user':
        return { label: 'User Registration', bg: 'bg-blue-100 text-blue-800 border-blue-300', iconBg: 'bg-blue-50 text-blue-600', icon: '👤' };
      case 'product':
        return { label: 'Product Listed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', iconBg: 'bg-emerald-50 text-emerald-600', icon: '🛍️' };
      default:
        return { label: 'System Alert', bg: 'bg-gray-100 text-gray-800 border-gray-300', iconBg: 'bg-gray-50 text-gray-600', icon: '🔔' };
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'subscription', label: 'Subscriptions' },
    { key: 'user', label: 'Users' },
    { key: 'product', label: 'Products' },
  ];

  return (
    <div className="min-h-screen bg-l5/40 flex flex-col">
      <Header name="Notifications" />

      <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl border border-l2 p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-xl text-13 font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-l4/70 text-g3 hover:bg-l4 hover:text-g1'
                }`}
              >
                {tab.label}
                {tab.key === 'unread' && pagination.unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#FF4423] text-white text-[10px]">
                    {pagination.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {pagination.unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-xl text-13 font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="icon-save text-14"></span>
                <span>Mark all as read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => setClearDialog(true)}
                className="px-4 py-2 rounded-xl text-13 font-semibold text-[#DC2626] border border-red-200 hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="icon-trash text-14"></span>
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => fetchNotifications(pagination.page, activeTab)}
              className="p-2 rounded-xl border border-l2 hover:bg-l4 text-g4 hover:text-g1 transition-all cursor-pointer"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-l2 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-g4 text-14 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <span>Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 rounded-full bg-l4 flex items-center justify-center mb-3">
                <span className="icon-notification text-[32px] text-g4"></span>
              </div>
              <h3 className="text-16 font-semibold text-g1">No notifications found</h3>
              <p className="text-13 text-g5 mt-1 max-w-sm">
                There are currently no notifications matching this view. Check back later for updates!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-l3">
              {notifications.map((item) => {
                const badge = getTypeBadge(item.type);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleItemClick(item)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-l4/50 cursor-pointer transition-all ${
                      !item.isRead ? 'bg-[#F4F9FF]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border ${badge.iconBg} border-l2 shadow-xs`}>
                        {badge.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {!item.isRead && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF4423] text-white">
                              New
                            </span>
                          )}
                          <span className="text-12 text-g5">
                            {item.createdAt ? moment(item.createdAt).format('DD MMM YYYY • hh:mm A') : ''}
                          </span>
                        </div>

                        <h4 className={`text-15 mb-0.5 ${!item.isRead ? 'font-bold text-g1' : 'font-semibold text-g2'}`}>
                          {item.title}
                        </h4>
                        <p className="text-13 text-g4 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {!item.isRead && (
                        <button
                          onClick={(e) => handleMarkSingleRead(item._id, e)}
                          className="text-12 text-g4 hover:text-primary font-medium px-3 py-1.5 rounded-lg border border-l2 hover:border-primary/40 bg-white transition-all"
                        >
                          Mark as read
                        </button>
                      )}
                      {item.link && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-primary text-white text-12 font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <span className="icon-arrow-right text-[10px]"></span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-l2 flex items-center justify-between bg-l5/20">
              <span className="text-13 text-g4 font-medium">
                Page {pagination.page} of {pagination.totalPages} ({pagination.totalDocs} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchNotifications(pagination.page - 1, activeTab)}
                  className={`px-3 py-1.5 rounded-lg text-12 font-medium border border-l2 ${
                    pagination.page <= 1 ? 'opacity-40 cursor-not-allowed bg-l4' : 'hover:bg-white cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchNotifications(pagination.page + 1, activeTab)}
                  className={`px-3 py-1.5 rounded-lg text-12 font-medium border border-l2 ${
                    pagination.page >= pagination.totalPages ? 'opacity-40 cursor-not-allowed bg-l4' : 'hover:bg-white cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear All Confirmation Dialog */}
      {clearDialog && (
        <CommonDialog
          isOpen={clearDialog}
          onClose={() => setClearDialog(false)}
          onSubmit={handleClearAll}
          title="Clear All Notifications"
          description="Are you sure you want to clear all notifications? This action cannot be undone."
          buttonNames={{ firstBtn: "Cancel", secondBtn: "Clear All" }}
        />
      )}
    </div>
  );
};

export default Notifications;