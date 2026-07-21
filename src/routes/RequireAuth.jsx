import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
    const location = useLocation();
    const token = localStorage.getItem("accessToken");
    return token ? (
        <Outlet />
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth