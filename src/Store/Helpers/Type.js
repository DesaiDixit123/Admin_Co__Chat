// Helper to create LOADING / SUCCESS / ERROR action types
const createActionTypes = (base) => ({
  LOADING: `${base}_LOADING`,
  SUCCESS: `${base}_SUCCESS`,
  ERROR: `${base}_ERROR`,
});

// Helper to generate action type groups for a feature
const createFeatureActions = (featureName, actions) => {
  return actions.reduce((acc, action) => {
    acc[action] = createActionTypes(`${action}_${featureName}`);
    return acc;
  }, {});
};

// Define actions for each module
export const AUTH = createFeatureActions("AUTH", [
  "LOGIN",
  "VERIFY_OTP",
  "SET_PASSWORD",
  "FORGET_PASSWORD",
  "GET_PROFILE",
  "UPDATE_PROFILE",
]);

// Optional sync action types
export const AUTH_SYNC = {
  LOGOUT: "LOGOUT",
  SET_VERIFY_EMAIL: "SET_VERIFY_EMAIL",
};

export const SIDEBAR_SYNC = {
  TOGGLE_DESKTOP: "TOGGLE_DESKTOP",
  TOGGLE_MOBILE: "TOGGLE_MOBILE",
};

// Admin related action types
export const ADMIN = createFeatureActions("ADMIN", [
  "SAVE",
  "LIST_WITHOUT_PAGINATION",
  "LIST_WITH_PAGINATION",
  "GET_ONE",
  "CHANGE_STATUS",
]);

// Role related action types
export const ROLE = createFeatureActions("ROLE", [
  "SAVE",
  "LIST_WITHOUT_PAGINATION",
  "LIST_WITH_PAGINATION",
  "GET_ONE",
  "REMOVE",
  "CHANGE_STATUS",
  "ALL_PERMISSION",
]);

// Category related action types
export const CATEGORIES = createFeatureActions("CATEGORIES", [
  "SAVE",
  "LIST_WITHOUT_PAGINATION",
  "LIST_WITH_PAGINATION",
  "GET_ONE",
  "REMOVE",
  "CHANGE_STATUS",
]);

// Users related action types
export const USERS = createFeatureActions("USER", [
  "LIST_WITH_PAGINATION",
  "GET_ONE",
  "CHANGE_STATUS",
  "REMOVE",
]);

// Product related action types
export const PRODUCTS = createFeatureActions("PRODUCT", [
  "LIST_WITH_PAGINATION",
  "GET_ONE",
  "CHANGE_STATUS",
]);

// Dashboard related action types
export const DASHBOARD = createFeatureActions("DASHBOARD", [
  "METRICS",
  "CALL_ANALYTICS",
  "RECENT_USERS",
]);