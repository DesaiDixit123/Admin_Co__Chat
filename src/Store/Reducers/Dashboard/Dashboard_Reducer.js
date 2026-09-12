import { createAsyncReducer } from "../../Helpers/AsyncReducerHelper";
import { DASHBOARD } from "../../Helpers/Type";

export const dashboardMetricsReducer = createAsyncReducer(DASHBOARD.METRICS);
export const dashboardCallAnalyticsReducer = createAsyncReducer(DASHBOARD.CALL_ANALYTICS);
export const dashboardRecentUsersReducer = createAsyncReducer(DASHBOARD.RECENT_USERS);
