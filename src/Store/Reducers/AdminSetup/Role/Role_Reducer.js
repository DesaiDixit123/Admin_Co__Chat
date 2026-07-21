import { createAsyncReducer } from "../../../Helpers/AsyncReducerHelper";
import { ROLE } from "../../../Helpers/Type";

export const roleSaveReducer = createAsyncReducer(ROLE.SAVE);
export const roleListWithoutPaginationReducer = createAsyncReducer(ROLE.LIST_WITHOUT_PAGINATION);
export const roleListWithPaginationReducer = createAsyncReducer(ROLE.LIST_WITH_PAGINATION);
export const roleGetOneReducer = createAsyncReducer(ROLE.GET_ONE);
export const roleDeleteReducer = createAsyncReducer(ROLE.REMOVE);
export const roleChangeStatusReducer = createAsyncReducer(ROLE.CHANGE_STATUS);
export const roleAllPermissionReducer = createAsyncReducer(ROLE.ALL_PERMISSION);
