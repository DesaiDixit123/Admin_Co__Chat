import { useSelector } from "react-redux";
import { useMemo } from "react";

const selectVerifyEmail = (state) => state?.setVerifyEmailReducer || "";
export const useVerifyEmail = () => {
  const verifyEmail = useSelector(selectVerifyEmail);
  return useMemo(() => verifyEmail, [verifyEmail]);
};

const selectPageName = (state) => state?.pageNameReducer?.pageName || "";
export const usePageName = () => {
  const pageName = useSelector(selectPageName);
  return useMemo(() => pageName, [pageName]);
};

const selectUserProfile = (state) => state?.GetProfileReducer?.payload || {};
export const useUserProfile = () => {
  const userProfile = useSelector(selectUserProfile);
  return useMemo(() => userProfile, [userProfile]);
}

