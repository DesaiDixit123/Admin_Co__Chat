import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

// 🔹 axios instance with base URL
const api = axios.create({
    baseURL: API_BASE_URL
});

// 🔹 Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;


    if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        if (response.config?.responseType === 'blob' || response.data instanceof Blob) {
            return response;
        }
        if (response?.data?.IsSuccess) {
            // toast.success(response?.data?.Message);
        } else {
            if (response?.data?.Message || response?.data?.message) {
                toast.error(response?.data?.Message || response?.data?.message);
            }
        }
        return response;
    },
    (error) => {
        toast.error(error?.response?.data?.Message || error?.response?.data?.message);
        console.error("Axios Error:", error);
        const errorMessage =
            error?.response?.data?.Message || error?.response?.data?.message;
        if (typeof errorMessage === "string") {
            // toast.error(errorMessage);
        } else if (Array.isArray(errorMessage)) {
            errorMessage.forEach((msg) => console.log("msg", msg));
        } else {
            console.log("Something went wrong!");
        }

        return Promise.reject(error);
    }
);
// 🔹 Auth APIs
export const login = (data) => api.post("admin/login", data);
export const verifyOtp = (data) => api.post("admin/verifyotp", data);
export const setPassword = (data) => api.post("admin/setpassword", data);
export const forgetPassword = (data) => api.post("admin/forgetpassword", data);
export const getProfile = () => api.get("admin/user/getprofile");
export const updateProfile = (data) => api.post("admin/user/editprofile", data);

// 🔹 Admin APIs
export const adminSave = (data) => api.post("admin/user/save", data);
export const adminListWithoutPagination = (data) => api.post("admin/user", data);
export const adminListWithPagination = (data) => api.post("admin/user/list", data);
export const adminGetOne = (data) => api.post('admin/user/getone', data);
export const adminChangeStatus = (data) => api.post("admin/user/change", data);

// 🔹 Role & Permission APIs
export const roleSave = (data) => api.post("admin/role/save", data);
export const roleListWithoutPagination = (data) => api.post("admin/role", data);
export const roleListWithPagination = (data) => api.post("admin/role/list", data);
export const roleGetOne = (data) => api.post('admin/role/getone', data);
export const roleDelete = (data) => api.post("admin/role/remove", data);
export const roleChangeStatus = (data) => api.post("admin/role/change", data);
export const roleAllPermission = () => api.get("admin/role/getpermission");

// 🔹 Categories APIs
export const categoriesSave = (data) => api.post("admin/category/save", data);
export const categoriesListWithoutPagination = (data) => api.post("admin/category/list-without-pagination", data);
export const categoriesListWithPagination = (data) => api.post("admin/category/list", data);
export const categoriesGetOne = (data) => api.post('admin/category/getone', data);
export const categoriesDelete = (data) => api.post("admin/category/delete", data);
export const categoriesChangeStatus = (data) => api.post("admin/category/change-status", data);

// 🔹 users APIs
export const usersListWithPagination = (data) => api.post("admin/users/list", data);
export const usersGetOne = (data) => api.post('admin/users/view', data);
export const usersChangeStatus = (data) => api.post("admin/users/status/change", data); 
export const usersDelete = (data) => api.post("admin/users/delete", data); 

// 🔹 Products APIs
export const productsListWithPagination = (data) => api.post("admin/products/list", data);
export const productsGetOne = (data) => api.post('admin/products/view', data);
export const productsChangeStatus = (data) => api.post("admin/products/status/change", data);
export const productsDelete = (data) => api.post("admin/products/delete", data);

// 🔹 Dashboard APIs
export const dashboardMetrics = (data) => api.post("admin/dashboard/count", data);
export const dashboardCallAnalytics = (range = "daily") => api.post(`admin/dashboard/call?range=${range}`);
export const dashboardRecentUsers = (data) => api.post("admin/dashboard/users", data);

// 🔹 Plan & Subscription APIs
export const planSave = (data) => api.post("admin/plans/add", data);
export const planListWithPagination = (data) => api.post("admin/plans/list", data);
export const planListAll = (data) => api.post("admin/plans/list-all", data);
export const planGetOne = (data) => api.post("admin/plans/view", data);
export const planChangeStatus = (data) => api.post("admin/plans/status/change", data);
export const planDelete = (data) => api.post("admin/plans/delete", data);
export const planFunctionalityListAll = (data) => api.post("admin/plan-functionality/list-all", data || {});
export const planSubscribers = (data) => api.post("admin/plans/subscribers", data || {});
export const downloadSubscriberInvoice = (id) => api.get(`admin/plans/invoice-download/${id}`, { responseType: 'blob' });

// 🔹 GST APIs
export const gstGet = (data) => api.post("admin/gst/get", data || {});
export const gstSave = (data) => api.post("admin/gst/save", data);

// 🔹 Notification APIs
export const notificationListWithPagination = (data) => api.post("admin/notifications/list", data || {});
export const notificationMarkRead = (data) => api.post("admin/notifications/mark-read", data || {});
export const notificationClearAll = (data) => api.post("admin/notifications/clear-all", data || {});