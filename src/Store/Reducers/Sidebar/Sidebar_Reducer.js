export const setSidebarReducer = (state = true, action) => {
    if (action.type === "TOGGLE_DESKTOP") return action.payload;
    return state;
};

export const setSidebarMobileReducer = (state = false, action) => {
    if (action.type === "TOGGLE_MOBILE") return action.payload;
    return state;
};