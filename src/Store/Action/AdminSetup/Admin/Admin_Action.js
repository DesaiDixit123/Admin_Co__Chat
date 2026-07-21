import { createAsyncAction } from "../../../Helpers/AsyncActionHelper";
import * as AdminServices from "../../../../Services/services";
import { ADMIN } from "../../../Helpers/Type";

export const adminSave = createAsyncAction(AdminServices.adminSave, ADMIN.SAVE);
export const adminListWithoutPagination = createAsyncAction(AdminServices.adminListWithoutPagination, ADMIN.LIST_WITHOUT_PAGINATION);
export const adminListWithPagination = createAsyncAction(AdminServices.adminListWithPagination, ADMIN.LIST_WITH_PAGINATION);
export const adminGetOne = createAsyncAction(AdminServices.adminGetOne, ADMIN.GET_ONE);
export const adminChangeStatus = createAsyncAction(AdminServices.adminChangeStatus, ADMIN.CHANGE_STATUS);
