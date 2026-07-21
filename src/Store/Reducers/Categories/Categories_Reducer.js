
import { createAsyncReducer } from "../../Helpers/AsyncReducerHelper";
import { CATEGORIES } from "../../Helpers/Type";

export const categoriesSaveReducer = createAsyncReducer(CATEGORIES.SAVE);
export const categoriesListWithoutPaginationReducer = createAsyncReducer(CATEGORIES.LIST_WITHOUT_PAGINATION);
export const categoriesListWithPaginationReducer = createAsyncReducer(CATEGORIES.LIST_WITH_PAGINATION);
export const categoriesGetOneReducer = createAsyncReducer(CATEGORIES.GET_ONE);
export const categoriesDeleteReducer = createAsyncReducer(CATEGORIES.REMOVE);
export const categoriesChangeStatusReducer = createAsyncReducer(CATEGORIES.CHANGE_STATUS);