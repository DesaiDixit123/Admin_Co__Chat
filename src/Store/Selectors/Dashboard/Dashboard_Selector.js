import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useDashboardMetrics = () => {
  const data = useSelector((state) => state.dashboardMetricsReducer?.payload?.Data);
  return useMemo(() => data, [data]);
};

export const useDashboardMetricsLoading = () => {
  const loading = useSelector((state) => state.dashboardMetricsReducer?.loading);
  return useMemo(() => loading, [loading]);
};

export const useCallAnalytics = () => {
  const data = useSelector((state) => state.dashboardCallAnalyticsReducer?.payload?.Data);
  return useMemo(() => data, [data]);
};

export const useCallAnalyticsLoading = () => {
  const loading = useSelector((state) => state.dashboardCallAnalyticsReducer?.loading);
  return useMemo(() => loading, [loading]);
};

export const useRecentUsers = () => {
  const data = useSelector((state) => state.dashboardRecentUsersReducer?.payload?.Data);
  return useMemo(() => data, [data]);
};

export const useRecentUsersLoading = () => {
  const loading = useSelector((state) => state.dashboardRecentUsersReducer?.loading);
  return useMemo(() => loading, [loading]);
};
