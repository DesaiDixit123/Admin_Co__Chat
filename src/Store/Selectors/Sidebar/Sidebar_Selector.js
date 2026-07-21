import { useMemo } from "react";
import { useSelector } from "react-redux";

export const selectSideBar = (state) => state.setSidebarReducer;
export const useToggleSideBar = () => {
    const isOpen = useSelector(selectSideBar);
    return useMemo(() => isOpen, [isOpen]);
};

export const selectSideBarMobile = (state) => state.setSidebarMobileReducer;
export const useToggleSideBarMobile = () => {
    const isOpenMobile = useSelector(selectSideBarMobile);
    return useMemo(() => isOpenMobile, [isOpenMobile]);
};
