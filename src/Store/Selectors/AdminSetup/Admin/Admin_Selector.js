import { useMemo } from "react";
import { useSelector } from "react-redux";

const AdminList = (state) => state?.adminListWithPaginationReducer?.payload || {};
export const useAdminList = () => {
    const list = useSelector(AdminList);
    return useMemo(() => list, [list]);
};

const AdminData = (state) => state?.adminGetOneReducer?.payload || {};
export const useAdminData = () => {
    const data = useSelector(AdminData);
    return useMemo(() => data, [data]);
}
