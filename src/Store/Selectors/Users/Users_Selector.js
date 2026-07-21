import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useUserList = () => {
    const list = useSelector((state) => state.usersListWithPaginationReducer.payload.Data);
    return useMemo(() => list, [list]);
}

export const useUserData = () => {
    const list = useSelector((state) => state.usersGetOneReducer.payload?.Data);
    return useMemo(() => list, [list]);
}