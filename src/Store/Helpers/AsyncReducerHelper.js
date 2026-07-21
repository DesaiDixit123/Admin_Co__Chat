// src/store/helpers/AsyncReducerHelper.js

/**
 * Creates a generic reducer for async actions
 * @param {Object} types - { LOADING, SUCCESS, ERROR }
 * @param {Object} initialState - default state
 */
export const createAsyncReducer = (types, initialState = { payload: {}, loading: false, error: '' }) => {
  return (state = initialState, action) => {
    switch (action.type) {
      case types.LOADING:
        return { ...state, loading: true };

      case types.SUCCESS:
        return { ...state, payload: action.data, loading: false, error: '' };

      case types.ERROR:
        return { ...state, payload: action.data, loading: false, error: action.data };

      default:
        return state;
    }
  };
};
