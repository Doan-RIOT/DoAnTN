import { put, call, select } from 'redux-saga/effects';
import { cardsService } from '../Services/CardsService';
import CardsActions from '../Stores/Card/Actions';
import UserActions from '../Stores/User/Actions';

const getLanguage = state => state.user.language;

export function* fetchCards(action) {
  try {
    const { customerId } = action;
    const language = yield select(getLanguage);
    yield put(CardsActions.fetchCardsLoading());
    const response = yield call(cardsService.fetchCards, customerId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : {};
      yield put(CardsActions.fetchCardsSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(CardsActions.fetchCardsFailure(message));
    }
  } catch(error) {
    yield put(CardsActions.fetchCardsFailure('Error'));
  }
}
export function* fetchProject(action) {
  try {
    const response = yield call(cardsService.fetchProject);
    if (response) {
      // const data = response.data && data !== null ? response.data : [];
      // console.log('saga',response)
      yield put(CardsActions.fetchProjectSuccess(response));
    } else {
      console.log('error1')
    }
  }catch (error) {
    console.log('error2')
  }
}
