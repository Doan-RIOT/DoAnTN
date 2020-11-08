import { put, call, select } from 'redux-saga/effects';
import { branchService } from '../Services/BranchService';
import BranchActions from '../Stores/Branch/Actions';
import UserActions from '../Stores/User/Actions';

const getLanguage = state => state.user.language;

export function* fetchBrand(action) {
  try {
    const { categoryIds, city } = action;
    const language = yield select(getLanguage);
    yield put(BranchActions.fetchBrandLoading());
    const response = yield call(branchService.fetchBrand, categoryIds, city, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(BranchActions.fetchBrandSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(BranchActions.fetchBrandFailure(message));
    }
  } catch(error) {
    yield put(BranchActions.fetchBrandFailure('Error'));
  }
}

export function* fetchCategories() {
  try {
    const language = yield select(getLanguage);
    yield put(BranchActions.fetchCategoriesLoading());
    const response = yield call(branchService.fetchCategories, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(BranchActions.fetchCategoriesSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(BranchActions.fetchCategoriesFailure(message));
    }
  } catch(error) {
    yield put(BranchActions.fetchCategoriesFailure('Error'));
  }
}

export function* fetchBranch(action) {
  try {
    const { brandId, branchId } = action;
    const language = yield select(getLanguage);
    yield put(BranchActions.resetProduct());
    yield put(BranchActions.fetchBranchLoading());
    const response = yield call(branchService.fetchBranch, brandId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(BranchActions.fetchBranchSuccess(data));
      if (data.length > 0) {
        const branchIdFetch = branchId ? branchId : data[0].branchId;
        yield put(BranchActions.fetchProducts(branchIdFetch));
        yield put(BranchActions.fetchCategoriesBranch(branchIdFetch));
      }
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(BranchActions.fetchBranchFailure(message));
    }
  } catch(error) {
    yield put(BranchActions.fetchBranchFailure('Error'));
  }
}

export function* fetchProducts(action) {
  try {
    const { branchId } = action;
    const language = yield select(getLanguage);
    yield put(BranchActions.fetchProductsLoading());
    const response = yield call(branchService.fetchProducts, branchId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(BranchActions.fetchProductsSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(BranchActions.fetchProductsFailure(message));
    }
  } catch(error) {
    yield put(BranchActions.fetchProductsFailure('Error'));
  }
}

export function* fetchCategoriesBranch(action) {
  try {
    const { branchId } = action;
    const language = yield select(getLanguage);
    yield put(BranchActions.fetchCategoriesBranchLoading());
    const response = yield call(branchService.fetchCategoriesBranch, branchId, language);
    if (response.success) {
      const data  = response.data && data !== null ? response.data : [];
      yield put(BranchActions.fetchCategoriesBranchSuccess(data));
    } else {
      const { message, errorCode } = response;
      yield put(UserActions.setErrorCode(errorCode));
      yield put(BranchActions.fetchCategoriesBranchFailure(message));
    }
  } catch(error) {
    yield put(BranchActions.fetchCategoriesBranchFailure('Error'));
  }
}
