import { createAsyncAction } from "../../Helpers/AsyncActionHelper";
import * as UserServices from "../../../Services/services";
import { USERS } from "../../Helpers/Type";

export const usersListWithPagination = createAsyncAction(UserServices.usersListWithPagination, USERS.LIST_WITH_PAGINATION);
export const usersGetOne = createAsyncAction(UserServices.usersGetOne, USERS.GET_ONE);
export const usersChangeStatus = createAsyncAction(UserServices.usersChangeStatus, USERS.CHANGE_STATUS);