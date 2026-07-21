import { createAsyncReducer } from "../../Helpers/AsyncReducerHelper";
import { AUTH, AUTH_SYNC } from "../../Helpers/Type";

// Each reducer is just one line
export const LoginReducer = createAsyncReducer(AUTH.LOGIN);
export const verifyOtpReducer = createAsyncReducer(AUTH.VERIFY_OTP);
export const SetPasswordReducer = createAsyncReducer(AUTH.SET_PASSWORD);
export const ForgotPasswordReducer = createAsyncReducer(AUTH.FORGET_PASSWORD);
export const GetProfileReducer = createAsyncReducer(AUTH.GET_PROFILE);
export const UpdateProfileReducer = createAsyncReducer(AUTH.UPDATE_PROFILE);
export const setVerifyEmailReducer = (state = "", action) => {
    if (action.type === AUTH_SYNC.SET_VERIFY_EMAIL) return action.payload;
    return state;
};