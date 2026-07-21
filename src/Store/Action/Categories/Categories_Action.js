import { createAsyncAction } from "../../Helpers/AsyncActionHelper";
import * as CategoriesServices from "../../../Services/services";
import { CATEGORIES } from "../../Helpers/Type";

export const categoriesSave = createAsyncAction(CategoriesServices.categoriesSave, CATEGORIES.SAVE);
export const categoriesListWithoutPagination = createAsyncAction(CategoriesServices.categoriesListWithoutPagination, CATEGORIES.LIST_WITHOUT_PAGINATION);
export const categoriesListWithPagination = createAsyncAction(CategoriesServices.categoriesListWithPagination, CATEGORIES.LIST_WITH_PAGINATION);
export const categoriesGetOne = createAsyncAction(CategoriesServices.categoriesGetOne, CATEGORIES.GET_ONE);
export const categoriesDelete = createAsyncAction(CategoriesServices.categoriesDelete, CATEGORIES.REMOVE);
export const categoriesChangeStatus = createAsyncAction(CategoriesServices.categoriesChangeStatus, CATEGORIES.CHANGE_STATUS);