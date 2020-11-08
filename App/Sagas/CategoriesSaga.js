import { put, call, select } from 'redux-saga/effects';
import { categoriesService } from '../Services/CategoriesService';
import CategoriesActions from '../Stores/Categories/Actions';
import UserActions from '../Stores/User/Actions';

const getLanguage = state => state.user.language;

export function* fetchProductsByCategory(action) {
  try {
    const { dataPost } = action;
    const language = yield select(getLanguage);
    yield put(CategoriesActions.fetchProductsByCategoryLoading());
    const response = yield call(categoriesService.fetchProducts, dataPost, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : {};
      yield put(CategoriesActions.fetchProductsByCategorySuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(CategoriesActions.fetchProductsFailure(message));
    }
  } catch(error) {
    yield put(CategoriesActions.fetchProductsByCategoryFailure('Error'));
  }
}

export function* fetchParentCategory(action) {
  try {
    const { categoryId } = action;
    const language = yield select(getLanguage);
    yield put(CategoriesActions.fetchParentCategoryLoading());
    const response = yield call(categoriesService.fetchParentCategory, categoryId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(CategoriesActions.fetchParentCategorySuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(CategoriesActions.fetchParentCategoryFailure(message));
    }
  } catch(error) {
    yield put(CategoriesActions.fetchParentCategoryFailure('Error'));
  }
}
