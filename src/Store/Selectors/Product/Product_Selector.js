import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useProductList = () => {
    const list = useSelector((state) => state?.productsListWithPaginationReducer?.payload?.Data);
    return useMemo(() => list, [list]);
}

export const useProductData = () => {
    const list = useSelector((state) => state?.productsGetOneReducer?.payload?.Data);
    return useMemo(() => list, [list]);
}