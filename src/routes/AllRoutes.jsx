import { Navigate, Route, Routes } from "react-router-dom"
import RequireAuth from "./RequireAuth"
import Login from "../auth/Login"
import ForgetPassword from "../auth/ForgetPassword"
import CreateYourPassword from "../auth/CreateYourPassword"
import VerifyOTP from "../auth/VerifyOTP"
import AddEditRolePermission from "../pages/AdminSetup/RolePermission/AddEditRolePermission"
import AddEditAdmin from "../pages/AdminSetup/Admin/AddEditAdmin"
import AllAdmin from "../pages/AdminSetup/Admin/AllAdmin"
import UserDetails from "../pages/Users/UserDetails"
import AllUsers from "../pages/Users/AllUsers"
import Sidebar from "../components/Sidebar"
import Dashboard from "../pages/Dashboard/Dashboard"
import Notifications from "../pages/Notifications/Notifications"
import AllRolePermission from "../pages/AdminSetup/RolePermission/AllRolePermission"
import AllProducts from "../pages/Products/AllProducts"
import AllCategories from "../pages/Categories/AllCategories"
import ProductDetails from "../pages/Products/ProductDetails"
import AllPlanSubscription from "../pages/PlanSubscription/AllPlanSubscription"
import AddEditPlanSubscription from "../pages/PlanSubscription/AddEditPlanSubscription"
import SupportTicket from "../pages/SupportTicket/AllSupportTicket"
import SupportTicketDetails from "../pages/SupportTicket/SupportTicketDetails"
import GSTManagement from "../pages/Master/GSTManagement"
import SubscribedUsers from "../pages/PlanSubscription/SubscribedUsers"

const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/verify-otp' element={<VerifyOTP />} />
                <Route path="/create-your-password" element={<CreateYourPassword />} />

                <Route element={<RequireAuth />}>
                    <Route element={<Sidebar />} >
                        <Route path="/" element={<Navigate to="/dashboard" />} />

                        {/* Dashboard */}
                        <Route path="dashboard" index element={<Dashboard />} />


                        {/* Notification */}
                        <Route path="notification" element={<Notifications />} />

                        {/* Users */}
                        <Route path="users" element={<AllUsers />} />
                        <Route path="users/details/:id" element={<UserDetails />} />

                        {/* Admin Setup */}
                        {/* Admin */}
                        <Route path='admin' element={<AllAdmin />} />
                        <Route path='admin/create' element={<AddEditAdmin />} />
                        <Route path='admin/edit/:id' element={<AddEditAdmin />} />
                        {/* Role and Permission */}
                        <Route path='role-permission' element={<AllRolePermission />} />
                        <Route path='role-permission/create' element={<AddEditRolePermission />} />
                        <Route path='role-permission/edit/:id' element={<AddEditRolePermission />} />

                        {/* Products */}
                        <Route path="products" element={<AllProducts />} />
                        <Route path="products/details/:id" element={<ProductDetails />} />

                        {/* Master */}
                        <Route path="master/gst" element={<GSTManagement />} />
                        {/* Categories */}
                        <Route path="categories" element={<AllCategories />} />

                        {/* Plan Subscription   */}
                        <Route path="plans-subscription" element={<AllPlanSubscription />} />
                        <Route path="plans-subscription/subscribers" element={<SubscribedUsers />} />
                        <Route path="plans-subscription/create" element={<AddEditPlanSubscription />} />
                        <Route path="plans-subscription/edit/:id" element={<AddEditPlanSubscription />} />

                        {/* Support Ticket (Hidden) */}
                        <Route path="support-ticket" element={<Navigate to="/dashboard" replace />} />
                        <Route path="support-ticket/details/:id" element={<Navigate to="/dashboard" replace />} />

                        {/* Catch-all fallback (optional but useful) */}
                        <Route path={`*`} element={<Navigate to="/dashboard" />} />

                    </Route>
                </Route>

            </Routes>
        </>
    )
}

export default AllRoutes