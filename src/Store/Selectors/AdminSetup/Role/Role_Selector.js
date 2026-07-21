import { useMemo } from "react";
import { useSelector } from "react-redux";

const selectRoleList = (state) => state?.roleListWithPaginationReducer?.payload || {};
export const useRoleList = () => {
    const roleList = useSelector(selectRoleList);
    return useMemo(() => roleList, [roleList]);
}

const selectRoleWithoutPage = (state) => state?.roleListWithoutPaginationReducer?.payload
export const useRoleWithoutPage = () => {
    const role = useSelector(selectRoleWithoutPage)
    return useMemo(() => role, [role])
}