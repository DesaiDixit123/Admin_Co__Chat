import { useCallback, useMemo, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToggleSideBar, useToggleSideBarMobile, } from "../Store/Selectors/Sidebar/Sidebar_Selector";
import { setSidebarOpen, setSidebarOpenMobile, } from "../Store/Action/Sidebar/Sidebar_Action";
import { assets } from "../assets/images/assets";

const MenuLeftBar = ({ InMenu = [], MainMenu = [] }) => {
    const isOpen = useToggleSideBar();
    const isOpenMobile = useToggleSideBarMobile();
    const dispatch = useDispatch();
    const location = useLocation();

    // Track only which dropdown is manually opened
    const [openMenu, setOpenMenu] = useState(null);

    // Check if any inner menu is active
    const isAnyInnerMenuActive = useCallback(
        (mainMenu) =>
            InMenu.some(
                (innerItem) =>
                    innerItem.mainMenu === mainMenu.displayname &&
                    location.pathname.includes(innerItem.route)
            ),
        [InMenu, location.pathname]
    );
    // Derived menu list (NO useEffect, NO setState)
    const mainMenus = useMemo(() => {
        return MainMenu.map(menu => ({
            ...menu,
            isOpen:
                openMenu === menu.displayname ||
                isAnyInnerMenuActive(menu),
        }));
    }, [MainMenu, openMenu, isAnyInnerMenuActive]);
    const toggleDropdown = (menu) => {
        setOpenMenu((prev) =>
            prev === menu.displayname ? null : menu.displayname
        );
        dispatch(setSidebarOpen(true));
    };

    return (
        <aside id="open_sidebar" className={`fixed inset-y-0 left-0 w-[240px] 2xl:w-[270px] h-screen overflow-y-auto overflow-x-hidden bg-b4 border-r border-b3 ${isOpenMobile ? "-translate-x-0" : "-translate-x-full"}   ${isOpen ? "lg:translate-x-0" : ""} anim z-50`}>
            <div className="w-64 lg:w-full h-full relative bg-white shadow overflow-y-auto">
                <span
                    className="icon-close text-18 absolute right-2 top-2 lg:hidden cursor-pointer"
                    onClick={() => {
                        dispatch(setSidebarOpenMobile(false));
                    }}
                />
                <div className="pt-8 lg:pt-6 2xl:pt-8 px-4 lg:px-5 2xl:px-7">
                    <div className="border-b-[1.5px] border-l1 pb-4 lg:pb-6 2xl:pb-8">
                        <Link to="/dashboard">
                            <img src={assets.logo} className={`mx-auto max-h-[68px] 2xl:max-h-[82px] w-auto object-contain ${isOpen ? "max-w-[150px] 2xl:max-w-[164px]" : "max-w-10"}`} alt="ChatNest" />
                        </Link>
                    </div>
                </div>
                <div className="py-3.5 lg:py-5 2xl:py-7 px-3.5">
                    <ul className="space-y-1.5">
                        <li className="group relative">
                            <NavLink to={`/dashboard`} className={({ isActive }) => `nav_link anim group-hover:bg-primary relative ${isActive ? 'active' : ''}`}>
                                <span className={`icon-dashboard text-[18px] lg:text-[20px] xl:text-[24px] text-g1 group-hover:text-white anim`}></span>
                                <span className={`text16 text-g1 font-medium group-hover:text-white whitespace-nowrap anim ml-2 2xl:ml-3 ${!isOpen ? "hidden invisible overflow-hidden w-0" : " inline-block"}`}>Dashboard</span>
                            </NavLink>
                        </li>
                        {
                            mainMenus.map((item, index) => {
                                const isActive = isAnyInnerMenuActive(item);
                                const showInner = item.isOpen || isActive;
                                return (
                                    <li className="group relative" key={index}>
                                        {item?.route == "" ? <div className={`nav_link anim group-hover:bg-primary relative cursor-pointer ${showInner ? "active" : ""}`} onClick={() => { toggleDropdown(item); dispatch(setSidebarOpen(true)) }}>
                                            <span className={`${item?.icon} text-[18px] lg:text-[20px] xl:text-[24px] text-g1 group-hover:text-white anim`}></span>
                                            <span className={`text16 text-g1 inline-block font-medium group-hover:text-white whitespace-nowrap anim ml-2 2xl:ml-3 ${!isOpen ? "invisible overflow-hidden w-0" : ""}`}>{item.displayname}</span>
                                            <span style={{ marginLeft: "auto !important" }} className="block icon-arrow-down text-[16px] lg:text-[18px] xl:text-[20px] text-g7 group-hover:text-white anim ml-auto"></span>
                                        </div> :
                                            <NavLink to={`/${item?.route}`} className="nav_link anim group-hover:bg-primary relative" onClick={() => { toggleDropdown(item); isOpenMobile && setSidebarOpenMobile(false) }}>
                                                <span className={`${item?.icon} text-[18px] lg:text-[20px] xl:text-[24px] text-g1 group-hover:text-white anim`}></span>
                                                <span className="text16 text-g1 inline-block font-medium group-hover:text-white whitespace-nowrap anim ml-2 2xl:ml-3">{item.displayname}</span>
                                            </NavLink>}
                                        {item?.route == "" && isOpen && (
                                            <ul className={`inner_menu drop_down ${showInner ? "block" : "hidden"}`} >
                                                {InMenu.filter((innerItem) => innerItem.mainMenu === item.displayname).map((inItem, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <NavLink to={`../${inItem.route}`} className="text16 text-g1 block font-medium py-1.5 px-14 hover:text-primary whitespace-nowrap anim" activeclassname="active" onClick={() => isOpenMobile && setSidebarOpenMobile(false)}>
                                                                {inItem.displayname}
                                                            </NavLink>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                )
                            })}
                    </ul>
                </div>
            </div>
        </aside >
    );
};

export default MenuLeftBar;
