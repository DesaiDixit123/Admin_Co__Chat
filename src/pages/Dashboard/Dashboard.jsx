import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { assets } from '../../assets/images/assets';
import {
  getDashboardMetrics,
  getDashboardCallAnalytics,
  getDashboardRecentUsers,
} from '../../Store/Action/Dashboard/Dashboard_Action';
import {
  useDashboardMetrics,
  useDashboardMetricsLoading,
  useCallAnalytics,
  useCallAnalyticsLoading,
  useRecentUsers,
  useRecentUsersLoading,
} from '../../Store/Selectors/Dashboard/Dashboard_Selector';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [callRange, setCallRange] = useState('daily');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(moment().format('hh:mm:ss A'));

  const metrics = useDashboardMetrics();
  const metricsLoading = useDashboardMetricsLoading();

  const callAnalytics = useCallAnalytics();
  const callAnalyticsLoading = useCallAnalyticsLoading();

  const recentUsers = useRecentUsers();
  const recentUsersLoading = useRecentUsersLoading();

  const fetchDashboardData = useCallback(() => {
    dispatch(getDashboardMetrics());
    dispatch(getDashboardCallAnalytics(callRange));
    dispatch(getDashboardRecentUsers());
    setLastUpdated(moment().format('hh:mm:ss A'));
  }, [dispatch, callRange]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Periodic polling every 30 seconds to keep live data strictly updated
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Derived user statistics from backend database
  const totalUsers = metrics?.users?.all || 0;
  const activeUsers = metrics?.users?.active || 0;
  const inactiveUsers = metrics?.users?.inactive || 0;
  const activePercent = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Derived call statistics for distribution
  const totalCallMins = (metrics?.audioCalls?.monthlyMinutes || 0) + (metrics?.videoCalls?.monthlyMinutes || 0);
  const audioCallShare = totalCallMins > 0 ? Math.round(((metrics?.audioCalls?.monthlyMinutes || 0) / totalCallMins) * 100) : 50;

  // Call Analytics data extraction
  const audioData = callAnalytics?.audio || [];
  const videoData = callAnalytics?.video || [];

  // Determine max value for SVG chart scaling
  const maxMinutes = Math.max(
    ...audioData.map((d) => d.minutes || 0),
    ...videoData.map((d) => d.minutes || 0),
    10 // baseline minimum
  );

  return (
    <>
      <Header name="Dashboard" />

      <div className="p-4 md:p-6 lg:p-7 space-y-6 h-[calc(100vh-77px)] md:h-[calc(100vh-85px)] overflow-y-auto bg-l4/60">
        {/* Top bar: Welcome & Live Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-5 rounded-xl lg:rounded-2xl border border-l2 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-18 md:text-22 2xl:text-24 font-bold text-g1">
                Welcome to ChatNest Admin Dashboard
              </h3>
              <span className="inline-flex items-center gap-1.5 bg-green/10 text-green text-11 font-semibold px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
                Live DB Sync
              </span>
            </div>
            <p className="text-12 md:text-14 text-g6 mt-0.5">
              Live system overview, communication analytics, and database records.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-11 md:text-12 text-g5">
              Updated: <strong>{lastUpdated}</strong>
            </span>
            <button
              onClick={fetchDashboardData}
              disabled={metricsLoading}
              className="flex items-center space-x-1.5 text-12 md:text-14 font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3.5 py-2 rounded-xl transition cursor-pointer"
              title="Refresh Live Data"
            >
              <span className={`icon-swap text-14 ${metricsLoading ? 'animate-spin' : ''}`}></span>
              <span>{metricsLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* 1. Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Total Users */}
          <div
            onClick={() => navigate('/users')}
            className="bg-white p-4 2xl:p-5 rounded-xl lg:rounded-2xl border border-l2 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-12 md:text-13 font-semibold text-g5 uppercase tracking-wider">
                  Total Users
                </p>
                <h4 className="text-24 2xl:text-28 font-bold text-g1 mt-1">
                  {metricsLoading ? '...' : totalUsers}
                </h4>
              </div>
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition">
                <span className="icon-user text-20"></span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-l3 text-11 md:text-12">
              <span className="inline-flex items-center gap-1 text-green font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green"></span>
                {activeUsers} Active
              </span>
              <span className="text-g7">•</span>
              <span className="inline-flex items-center gap-1 text-g6">
                <span className="w-1.5 h-1.5 rounded-full bg-g7"></span>
                {inactiveUsers} Inactive
              </span>
            </div>
          </div>

          {/* Card 2: Total Products */}
          <div
            onClick={() => navigate('/products')}
            className="bg-white p-4 2xl:p-5 rounded-xl lg:rounded-2xl border border-l2 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-12 md:text-13 font-semibold text-g5 uppercase tracking-wider">
                  Products
                </p>
                <h4 className="text-24 2xl:text-28 font-bold text-g1 mt-1">
                  {metricsLoading ? '...' : metrics?.products?.total ?? 0}
                </h4>
              </div>
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                <span className="icon-gallery text-20"></span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-l3 text-11 md:text-12 text-g5 flex items-center justify-between">
              <span>Active Catalog</span>
              <span className="text-primary font-semibold group-hover:translate-x-1 transition">
                View &rarr;
              </span>
            </div>
          </div>

          {/* Card 4: Audio Call Minutes */}
          <div className="bg-white p-4 2xl:p-5 rounded-xl lg:rounded-2xl border border-l2 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-12 md:text-13 font-semibold text-g5 uppercase tracking-wider">
                  Audio Calls
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h4 className="text-24 2xl:text-28 font-bold text-primary">
                    {metricsLoading ? '...' : metrics?.audioCalls?.dailyMinutes || 0}
                  </h4>
                  <span className="text-12 text-g5 font-medium">min today</span>
                </div>
              </div>
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="icon-clock text-20"></span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-l3 text-11 md:text-12 text-g5">
              <span>Week: <strong>{metrics?.audioCalls?.weeklyMinutes || 0}m</strong></span>
              <span>Month: <strong>{metrics?.audioCalls?.monthlyMinutes || 0}m</strong></span>
            </div>
          </div>

          {/* Card 5: Video Call Minutes */}
          <div className="bg-white p-4 2xl:p-5 rounded-xl lg:rounded-2xl border border-l2 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-12 md:text-13 font-semibold text-g5 uppercase tracking-wider">
                  Video Calls
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <h4 className="text-24 2xl:text-28 font-bold text-sky-600">
                    {metricsLoading ? '...' : metrics?.videoCalls?.dailyMinutes || 0}
                  </h4>
                  <span className="text-12 text-g5 font-medium">min today</span>
                </div>
              </div>
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <span className="icon-eye text-20"></span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-l3 text-11 md:text-12 text-g5">
              <span>Week: <strong>{metrics?.videoCalls?.weeklyMinutes || 0}m</strong></span>
              <span>Month: <strong>{metrics?.videoCalls?.monthlyMinutes || 0}m</strong></span>
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Analytics Chart & System Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Call Analytics Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-l2 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h4 className="text-16 lg:text-18 font-bold text-g1">
                  Call Usage Analytics
                </h4>
                <p className="text-12 text-g6">
                  Live database call logs ({callRange})
                </p>
              </div>

              {/* Range Filters */}
              <div className="flex items-center bg-l3 p-1 rounded-xl self-start sm:self-auto">
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setCallRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-12 font-medium capitalize transition cursor-pointer ${
                      callRange === range
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-g5 hover:text-g1'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Dual-Bar Chart */}
            <div className="relative w-full h-64 md:h-72 mt-2">
              {callAnalyticsLoading ? (
                <div className="w-full h-full flex items-center justify-center text-g6 text-14">
                  <span className="icon-swap animate-spin mr-2"></span> Loading Analytics...
                </div>
              ) : audioData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-g6 text-14">
                  No call records available for this period.
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-between">
                  {/* Chart Plot Area */}
                  <div className="relative flex-1 flex items-end justify-between gap-2 md:gap-4 px-2 pt-6 pb-2 border-b border-l2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-g7 border-dashed w-full"></div>
                      <div className="border-b border-g7 border-dashed w-full"></div>
                      <div className="border-b border-g7 border-dashed w-full"></div>
                      <div className="border-b border-g7 border-dashed w-full"></div>
                    </div>

                    {audioData.map((item, idx) => {
                      const audioMin = item.minutes || 0;
                      const videoMin = videoData[idx]?.minutes || 0;

                      // Accurate proportional scaling: exactly 0 if minutes is 0
                      const audioHeightPct =
                        maxMinutes > 0 && audioMin > 0 ? (audioMin / maxMinutes) * 100 : 0;
                      const videoHeightPct =
                        maxMinutes > 0 && videoMin > 0 ? (videoMin / maxMinutes) * 100 : 0;

                      return (
                        <div
                          key={idx}
                          className="relative flex-1 flex items-end justify-center gap-1 md:gap-1.5 h-full group"
                          onMouseEnter={() =>
                            setHoveredBar({ idx, label: item.label, audioMin, videoMin })
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Audio Bar */}
                          {audioMin > 0 ? (
                            <div
                              style={{ height: `${audioHeightPct}%` }}
                              className="w-full max-w-[14px] md:max-w-[20px] bg-primary rounded-t-sm md:rounded-t-md transition-all duration-300 group-hover:brightness-110"
                            ></div>
                          ) : (
                            <div className="w-full max-w-[14px] md:max-w-[20px] h-[2px] bg-l2"></div>
                          )}

                          {/* Video Bar */}
                          {videoMin > 0 ? (
                            <div
                              style={{ height: `${videoHeightPct}%` }}
                              className="w-full max-w-[14px] md:max-w-[20px] bg-sky-500 rounded-t-sm md:rounded-t-md transition-all duration-300 group-hover:brightness-110"
                            ></div>
                          ) : (
                            <div className="w-full max-w-[14px] md:max-w-[20px] h-[2px] bg-l2"></div>
                          )}
                        </div>
                      );
                    })}

                    {/* Hover Tooltip Overlay */}
                    {hoveredBar && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-g1 text-white text-11 px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-3 z-10 anim">
                        <span className="font-bold text-white border-r border-white/20 pr-2">
                          {hoveredBar.label}
                        </span>
                        <span className="flex items-center gap-1 text-sky-200">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                          Audio: <strong>{hoveredBar.audioMin} min</strong>
                        </span>
                        <span className="flex items-center gap-1 text-sky-300">
                          <span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>
                          Video: <strong>{hoveredBar.videoMin} min</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex items-center justify-between px-2 pt-2 text-11 md:text-12 font-medium text-g5">
                    {audioData.map((item, idx) => (
                      <div key={idx} className="flex-1 text-center truncate">
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-l3 text-12 text-g6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-primary inline-block"></span>
                <span>Audio Call Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block"></span>
                <span>Video Call Minutes</span>
              </div>
            </div>
          </div>

          {/* System Distribution / Status Overview (1 Col) */}
          <div className="bg-white p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-l2 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-16 lg:text-18 font-bold text-g1">
                System Distribution
              </h4>
              <p className="text-12 text-g6 mb-5">
                Calculated from live database counts
              </p>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-13 font-semibold text-g1 mb-1.5">
                    <span>Active User Ratio</span>
                    <span className="text-green font-bold">{activePercent}%</span>
                  </div>
                  <div className="w-full bg-l3 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-green h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${activePercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-11 text-g6 mt-1">
                    <span>{activeUsers} active</span>
                    <span>{totalUsers} total registered</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-13 font-semibold text-g1 mb-1.5">
                    <span>Audio Call Share (30d)</span>
                    <span className="text-primary font-bold">{audioCallShare}%</span>
                  </div>
                  <div className="w-full bg-l3 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${audioCallShare}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-11 text-g6 mt-1">
                    <span>{metrics?.audioCalls?.monthlyMinutes || 0}m audio</span>
                    <span>{metrics?.videoCalls?.monthlyMinutes || 0}m video</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="mt-6 p-4 rounded-xl bg-l4 border border-l2 space-y-2 text-12">
              <div className="flex items-center justify-between text-g6">
                <span>Active Products</span>
                <strong className="text-g1">{metrics?.products?.total || 0}</strong>
              </div>
              <div className="flex items-center justify-between text-g6">
                <span>Total Calls Volume (30d)</span>
                <strong className="text-g1">
                  {(metrics?.audioCalls?.monthlyMinutes || 0) +
                    (metrics?.videoCalls?.monthlyMinutes || 0)}{' '}
                  min
                </strong>
              </div>
              <div className="flex items-center justify-between text-g6">
                <span>System Status</span>
                <span className="text-green font-semibold">
                  Operational (Live Sync)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Section: Recent Registered Users (from MongoDB) */}
        <div className="bg-white p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-l2 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-16 lg:text-18 font-bold text-g1">
                  Recently Registered Users
                </h4>
                <span className="bg-primary/10 text-primary text-11 font-semibold px-2 py-0.5 rounded-full">
                  Live Users Collection
                </span>
              </div>
              <p className="text-12 text-g6">
                Latest user accounts directly from database
              </p>
            </div>
            <button
              onClick={() => navigate('/users')}
              className="text-12 md:text-14 font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Users ({totalUsers})</span>
              <span className="icon-arrow-right text-10"></span>
            </button>
          </div>

          <div className="overflow-x-auto custom_table">
            <table className="w-full border-collapse border border-l3">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Mobile Number</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Registered Date</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentUsersLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-g6 text-14">
                      <span className="icon-swap animate-spin mr-2"></span> Fetching live users...
                    </td>
                  </tr>
                ) : recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-l4 transition">
                      <td>
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-l3 flex items-center justify-center shrink-0">
                            <img
                              src={assets.userDefaultImg}
                              className="w-full h-full object-cover"
                              alt="avatar"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-g1 block">
                              {user.fullname?.trim() ||
                                user.nickname?.trim() ||
                                (user.mobile ? `User (+91 ${user.mobile})` : `User #${user._id.slice(-6)}`)}
                            </span>
                            {!user.fullname && !user.nickname && (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                Profile Incomplete
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-medium text-g2">
                          {user.mobile ? user.mobile : '-'}
                        </span>
                      </td>
                      <td>
                        <span className="text-g5">
                          {user.email ? user.email : '-'}
                        </span>
                      </td>
                      <td>
                        <span className="capitalize text-g6">
                          {user.gender ? user.gender : '-'}
                        </span>
                      </td>
                      <td>
                        <span className="text-g6">
                          {user.createdAt
                            ? moment(user.createdAt).format('DD MMM YYYY, hh:mm A')
                            : '-'}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          title="View Details"
                          className="icon-eye text-[18px] text-primary hover:text-g1 cursor-pointer transition"
                          onClick={() => navigate(`/users/details/${user._id}`)}
                        ></span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-g6">
                      No recent users found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;