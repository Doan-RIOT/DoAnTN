import { put, call, select } from 'redux-saga/effects';
import { userService } from '../Services/UserService';
import UserActions from '../Stores/User/Actions';

const getLanguage = state => state.user.language;

export function* fetchProfile(action) {
  try {
    const { userId } = action;
    const language = yield select(getLanguage);
    yield put(UserActions.fetchProfileLoading());
    const response = yield call(userService.fetchProfile, userId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : {};
      yield put(UserActions.fetchProfileSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchProfileFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchProfileFailure('Error'));
  }
}

export function* fetchAddress(action) {
  try {
    const { userId } = action;
    const language = yield select(getLanguage);
    yield put(UserActions.fetchAddressLoading());
    const response = yield call(userService.fetchAddress, userId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(UserActions.fetchAddressSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchAddressFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchAddressFailure('Error'));
  }
}

export function* fetchLocation() {
  try {
    yield put(UserActions.fetchLocationLoading());
    const response = yield call(userService.fetchLocation);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(UserActions.fetchLocationSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchLocationFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchLocationFailure('Error'));
  }
}

export function* fetchHistoriesOrder(action) {
  try {
    const { userId } = action;
    const language = yield select(getLanguage);
    yield put(UserActions.fetchHistoriesOrderLoading());
    const response = yield call(userService.fetchHistoriesOrder, userId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(UserActions.fetchHistoriesOrderSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchHistoriesOrderFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchHistoriesOrderFailure('Error'));
  }
}

export function* fetchPromotion(action) {
  try {
    const { userId } = action;
    const language = yield select(getLanguage);
    yield put(UserActions.fetchPromotionLoading());
    const response = yield call(userService.fetchPromotion, userId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(UserActions.fetchPromotionSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchPromotionFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchPromotionFailure('Error'));
  }
}

export function* fetchFavorites(action) {
  try {
    const { userId } = action;
    const language = yield select(getLanguage);
    yield put(UserActions.fetchFavoritesLoading());
    const response = yield call(userService.fetchFavorites, userId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : {};
      yield put(UserActions.fetchFavoritesSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(UserActions.fetchFavoritesFailure(message));
    }
  } catch(error) {
    yield put(UserActions.fetchFavoritesFailure('Error'));
  }
}
