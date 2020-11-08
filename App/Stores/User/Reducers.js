/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { UserTypes } from './Actions';


export const setInfoUser = (state, { user }) => ({
  ...state,
  ...user,
});

export const resetUser = (state, {}) => ({
  ...state,
  profile: {},
  address: [],
  location: [],
  historiesOrder: [],
  promotion: [],
  favorites: {},
  errorCode: '',
  token: '',
  userId: '',
});

export const setErrorCode = (state, { errorCode }) => ({
  ...state,
  errorCode,
});

export const fetchProfileLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchProfileSuccess = (state, { profile }) => ({
  ...state,
  profile,
  loading: false,
  errorMessage: null,
})

export const fetchProfileFailure = (state, { errorMessage }) => ({
  ...state,
  profile: {},
  loading: false,
  errorMessage,
})

export const fetchAddressLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchAddressSuccess = (state, { address }) => ({
  ...state,
  address,
  loading: false,
  errorMessage: null,
})

export const fetchAddressFailure = (state, { errorMessage }) => ({
  ...state,
  address: [],
  loading: false,
  errorMessage,
})

export const fetchLocationLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchLocationSuccess = (state, { location }) => ({
  ...state,
  location,
  loading: false,
  errorMessage: null,
})

export const fetchLocationFailure = (state, { errorMessage }) => ({
  ...state,
  location: [],
  loading: false,
  errorMessage,
})

export const fetchHistoriesOrderLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchHistoriesOrderSuccess = (state, { historiesOrder }) => ({
  ...state,
  historiesOrder,
  loading: false,
  errorMessage: null,
})

export const fetchHistoriesOrderFailure = (state, { errorMessage }) => ({
  ...state,
  historiesOrder: [],
  loading: false,
  errorMessage,
})

export const fetchPromotionLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchPromotionSuccess = (state, { promotion }) => ({
  ...state,
  promotion,
  loading: false,
  errorMessage: null,
})

export const fetchPromotionFailure = (state, { errorMessage }) => ({
  ...state,
  promotion: [],
  loading: false,
  errorMessage,
})

export const fetchFavoritesLoading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
})

export const fetchFavoritesSuccess = (state, { favorites }) => ({
  ...state,
  favorites,
  loading: false,
  errorMessage: null,
})

export const fetchFavoritesFailure = (state, { errorMessage }) => ({
  ...state,
  favorites: {},
  loading: false,
  errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [UserTypes.SET_INFO_USER]: setInfoUser,
  [UserTypes.RESET_USER]: resetUser,
  [UserTypes.SET_ERROR_CODE]: setErrorCode,
  [UserTypes.FETCH_PROFILE_LOADING]: fetchProfileLoading,
  [UserTypes.FETCH_PROFILE_SUCCESS]: fetchProfileSuccess,
  [UserTypes.FETCH_PROFILE_FAILURE]: fetchProfileFailure,
  [UserTypes.FETCH_ADDRESS_LOADING]: fetchAddressLoading,
  [UserTypes.FETCH_ADDRESS_SUCCESS]: fetchAddressSuccess,
  [UserTypes.FETCH_ADDRESS_FAILURE]: fetchAddressFailure,
  [UserTypes.FETCH_LOCATION_LOADING]: fetchLocationLoading,
  [UserTypes.FETCH_LOCATION_SUCCESS]: fetchLocationSuccess,
  [UserTypes.FETCH_LOCATION_FAILURE]: fetchLocationFailure,
  [UserTypes.FETCH_HISTORIES_ORDER_LOADING]: fetchHistoriesOrderLoading,
  [UserTypes.FETCH_HISTORIES_ORDER_SUCCESS]: fetchHistoriesOrderSuccess,
  [UserTypes.FETCH_HISTORIES_ORDER_FAILURE]: fetchHistoriesOrderFailure,
  [UserTypes.FETCH_PROMOTION_LOADING]: fetchPromotionLoading,
  [UserTypes.FETCH_PROMOTION_SUCCESS]: fetchPromotionSuccess,
  [UserTypes.FETCH_PROMOTION_FAILURE]: fetchPromotionFailure,
  [UserTypes.FETCH_FAVORITES_LOADING]: fetchFavoritesLoading,
  [UserTypes.FETCH_FAVORITES_SUCCESS]: fetchFavoritesSuccess,
  [UserTypes.FETCH_FAVORITES_FAILURE]: fetchFavoritesFailure,
})
