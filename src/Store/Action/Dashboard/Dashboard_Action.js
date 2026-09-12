import { createAsyncAction } from "../../Helpers/AsyncActionHelper";
import * as DashboardServices from "../../../Services/services";
import { DASHBOARD } from "../../Helpers/Type";

export const getDashboardMetrics = createAsyncAction(
  DashboardServices.dashboardMetrics,
  DASHBOARD.METRICS
);

export const getDashboardCallAnalytics = createAsyncAction(
  DashboardServices.dashboardCallAnalytics,
  DASHBOARD.CALL_ANALYTICS
);

export const getDashboardRecentUsers = createAsyncAction(
  DashboardServices.dashboardRecentUsers,
  DASHBOARD.RECENT_USERS
);
