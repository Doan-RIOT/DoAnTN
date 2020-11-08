import { createActions } from 'reduxsauce'

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Stores/Example/Reducers.js
 * - to trigger sagas, for example in App/Sagas/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in App/App.js
 * - in sagas using `yield put(...)`, for example in App/Sagas/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const { Types, Creators } = createActions({
  setInfoUser: ['user'],
  fetchProfile: ['userId'],
  fetchProfileLoading: null,
  fetchProfileSuccess: ['profile'],
  fetchProfileFailure: ['errorMessage'],
  fetchAddress: ['userId'],
  fetchAddressLoading: null,
  fetchAddressSuccess: ['address'],
  fetchAddressFailure: ['errorMessage'],
  fetchLocation: null,
  fetchLocationLoading: null,
  fetchLocationSuccess: ['location'],
  fetchLocationFailure: ['errorMessage'],
  fetchHistoriesOrder: ['userId'],
  fetchHistoriesOrderLoading: null,
  fetchHistoriesOrderSuccess: ['historiesOrder'],
  fetchHistoriesOrderFailure: ['errorMessage'],
  fetchPromotion: ['userId'],
  fetchPromotionLoading: null,
  fetchPromotionSuccess: ['promotion'],
  fetchPromotionFailure: ['errorMessage'],
  fetchFavorites: ['userId'],
  fetchFavoritesLoading: null,
  fetchFavoritesSuccess: ['favorites'],
  fetchFavoritesFailure: ['errorMessage'],
  resetUser: null,
  setErrorCode: ['errorCode']
})

export const UserTypes = Types;
export default Creators;
