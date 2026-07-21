import { createAsyncAction } from "../../Helpers/AsyncActionHelper";
import * as AuthServices from "../../../Services/services";
import { AUTH, AUTH_SYNC } from "../../Helpers/Type";

export const login = createAsyncAction(AuthServices.login, AUTH.LOGIN);
export const verifyOtp = createAsyncAction(AuthServices.verifyOtp, AUTH.VERIFY_OTP);
export const setPassword = createAsyncAction(AuthServices.setPassword, AUTH.SET_PASSWORD);
export const forgetPassword = createAsyncAction(AuthServices.forgetPassword, AUTH.FORGET_PASSWORD);
export const getProfile = createAsyncAction(AuthServices.getProfile, AUTH.GET_PROFILE);
export const updateProfile = createAsyncAction(AuthServices.updateProfile, AUTH.UPDATE_PROFILE);

// Synchronous action creators for logout and setVerifyEmail
export const logoutUser = () => { localStorage.clear(); return { type: AUTH_SYNC.LOGOUT }; };
export const setVerifyEmail = (payload) => ({
    type: AUTH_SYNC.SET_VERIFY_EMAIL,
    payload,
});
