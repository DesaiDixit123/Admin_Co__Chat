import { createAsyncReducer } from "../../../Helpers/AsyncReducerHelper";
import { ADMIN } from "../../../Helpers/Type";

// Each reducer is just one line
export const adminSaveReducer = createAsyncReducer(ADMIN.SAVE);
export const adminListWithoutPaginationReducer = createAsyncReducer(ADMIN.LIST_WITHOUT_PAGINATION);
export const adminListWithPaginationReducer = createAsyncReducer(ADMIN.LIST_WITH_PAGINATION);
export const adminGetOneReducer = createAsyncReducer(ADMIN.GET_ONE);
export const adminChangeStatusReducer = createAsyncReducer(ADMIN.CHANGE_STATUS);
