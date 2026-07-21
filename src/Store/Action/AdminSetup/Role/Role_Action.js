import { createAsyncAction } from "../../../Helpers/AsyncActionHelper";
import * as Role from "../../../../Services/services";
import { ROLE } from "../../../Helpers/Type";

export const roleSave = createAsyncAction(Role.roleSave, ROLE.SAVE);
export const roleListWithoutPagination = createAsyncAction(Role.roleListWithoutPagination, ROLE.LIST_WITHOUT_PAGINATION);
export const roleListWithPagination = createAsyncAction(Role.roleListWithPagination, ROLE.LIST_WITH_PAGINATION);
export const roleGetOne = createAsyncAction(Role.roleGetOne, ROLE.GET_ONE);
export const roleDelete = createAsyncAction(Role.roleDelete, ROLE.REMOVE);
export const roleChangeStatus = createAsyncAction(Role.roleChangeStatus, ROLE.CHANGE_STATUS);
export const roleAllPermission = createAsyncAction(Role.roleAllPermission, ROLE.ALL_PERMISSION);
