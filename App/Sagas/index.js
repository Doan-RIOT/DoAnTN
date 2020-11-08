import { takeLatest, all } from 'redux-saga/effects'
import { UserTypes  } from '../Stores/User/Actions';
import {
  fetchProfile, fetchAddress,
  fetchLocation, fetchHistoriesOrder,
  fetchPromotion, fetchFavorites,
} from './UserSaga';
import { BranchTypes  } from '../Stores/Branch/Actions';
import {
  fetchBrand, fetchCategories,
  fetchBranch, fetchProducts,
  fetchCategoriesBranch
} from './BranchSaga';
import { CategoriesTypes } from '../Stores/Categories/Actions';
import { fetchProductsByCategory, fetchParentCategory } from './CategoriesSaga'
import { CardsTypes } from '../Stores/Card/Actions';
import { fetchCards } from './CardsSaga';

import { ProcessTypes } from '../Stores/Process/Actions';
import { fetchProcess } from './ProcessSaga';

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(UserTypes.FETCH_PROFILE, fetchProfile),
    takeLatest(UserTypes.FETCH_ADDRESS, fetchAddress),
    takeLatest(UserTypes.FETCH_LOCATION, fetchLocation),
    takeLatest(UserTypes.FETCH_HISTORIES_ORDER, fetchHistoriesOrder),
    takeLatest(UserTypes.FETCH_FAVORITES, fetchFavorites),
    takeLatest(UserTypes.FETCH_PROMOTION, fetchPromotion),
    takeLatest(BranchTypes.FETCH_BRAND, fetchBrand),
    takeLatest(BranchTypes.FETCH_BRANCH, fetchBranch),
    takeLatest(BranchTypes.FETCH_CATEGORIES, fetchCategories),
    takeLatest(BranchTypes.FETCH_PRODUCTS, fetchProducts),
    takeLatest(BranchTypes.FETCH_CATEGORIES_BRANCH, fetchCategoriesBranch),
    takeLatest(CategoriesTypes.FETCH_PRODUCTS_BY_CATEGORY, fetchProductsByCategory),
    takeLatest(CategoriesTypes.FETCH_PARENT_CATEGORY, fetchParentCategory),
    takeLatest(CardsTypes.FETCH_CARDS, fetchCards),
    takeLatest(ProcessTypes.FETCH_PROCESS, fetchProcess)
  ])
}
