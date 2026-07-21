// src/store/helpers/asyncActionHelper.js

/**
 * Generic async thunk creator
 * @param {Function} serviceFn - API service function (returns a promise)
 * @param {Object} types - Redux action types { loading, success, error }
 */
export const createAsyncAction = (serviceFn, types) => (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOADING, data: true });

    const response = await serviceFn(data);

    if (response?.status === 200) {
      dispatch({ type: types.SUCCESS, data: response?.data });
      return response?.data;
    }
  } catch (error) {
    console.log('* Error ---->', error);
    dispatch({ type: types.ERROR, data: error?.response?.data?.message });
    throw error?.response?.data;
  }
};