import { createAsyncAction } from "../../Helpers/AsyncActionHelper";
import * as productServices from "../../../Services/services";
import { PRODUCTS } from "../../Helpers/Type";

export const productsListWithPagination = createAsyncAction(productServices.productsListWithPagination, PRODUCTS.LIST_WITH_PAGINATION);
export const productsGetOne = createAsyncAction(productServices.productsGetOne, PRODUCTS.GET_ONE);
export const productsChangeStatus = createAsyncAction(productServices.productsChangeStatus, PRODUCTS.CHANGE_STATUS);