import { createAsyncReducer } from "../../Helpers/AsyncReducerHelper";
import { PRODUCTS } from "../../Helpers/Type";

export const productsListWithPaginationReducer = createAsyncReducer(PRODUCTS.LIST_WITH_PAGINATION);
export const productsGetOneReducer = createAsyncReducer(PRODUCTS.GET_ONE);
export const productsDeleteReducer = createAsyncReducer(PRODUCTS.REMOVE);