import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useCategoriesList = () => {
    const list = useSelector((state) => state.categoriesListWithPaginationReducer.payload);
    return useMemo(() => list, [list]);
};

export const useCategoriesData = () => {
    const list = useSelector((state) => state.categoriesGetOneReducer.payload);
    return useMemo(() => list, [list]);
};