import React, { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { InMenu, MainMenu } from '../common/CommonArray';
import { useToggleSideBar } from '../Store/Selectors/Sidebar/Sidebar_Selector';
import MenuLeftBar from './MenuLeftBar';
import { useUserProfile } from '../Store/Selectors/Auth/Auth_Selector';

const Sidebar = () => {
  const adminUserDetails = useUserProfile();
  const isOpen = useToggleSideBar();

  const permissions = useMemo(() => adminUserDetails?.Data?.roleid?.permissions || [], [adminUserDetails]);
  
  const { filteredMainMenu, filteredInMenu } = useMemo(() => {
    // -------- SUB MENU --------
    const inMenuResult = InMenu
      .map((item) => {
        const hasPermission = item.isAlwaysVisible || permissions.some(
          (p) => p.displayname === item.displayname && p.view
        );

        return {
          ...item,
          view: hasPermission,
        };
      })
      .filter((item) => item.view);

    // -------- MAIN MENU --------
    const mainMenuResult = MainMenu
      .map((mainItem) => {
        const hasDirectPermission = mainItem.isAlwaysVisible || permissions.some(
          (p) => p.displayname === mainItem.displayname && p.view
        );

        const hasChildPermission = inMenuResult.some(
          (child) => child.mainMenu === mainItem.displayname
        );

        return {
          ...mainItem,
          view: hasDirectPermission || hasChildPermission,
        };
      })
      .filter((item) => item.view);

    return {
      filteredMainMenu: mainMenuResult,
      filteredInMenu: inMenuResult,
    };
  }, [permissions]);
  return (
    <>
      <div className={`flex w-full side_bar  ${isOpen ? '' : 'active'}`} id="open">
        <MenuLeftBar MainMenu={filteredMainMenu} InMenu={filteredInMenu} />
        <div className={`w-full ${isOpen ? "lg:w-[calc(100%-240px)] 2xl:w-[calc(100%-270px)]" : "lg:w-full"}  ml-auto relative anim`}>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Sidebar