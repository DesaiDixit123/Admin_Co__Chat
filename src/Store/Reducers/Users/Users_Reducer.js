import { createAsyncReducer } from "../../Helpers/AsyncReducerHelper";
import { USERS } from "../../Helpers/Type";

export const usersListWithPaginationReducer = createAsyncReducer(USERS.LIST_WITH_PAGINATION);
export const usersGetOneReducer = createAsyncReducer(USERS.GET_ONE);