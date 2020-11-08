/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { BranchTypes } from './Actions';

export const fetchBrandLoading = (state) => ({
  ...state,
  loadingListBrand: true,
  errorMessage: null,
})

export const fetchBrandSuccess = (state, { brands }) => ({
  ...state,
  brands,
  loadingListBrand: false,
  errorMessage: null,
})

export const fetchBrandFailure = (state, { errorMessage }) => ({
  ...state,
  brands: [],
  loadingListBrand: false,
  errorMessage,
})

export const fetchCategoriesLoading = (state) => ({
  ...state,
  loadingCategories: true,
  errorMessage: null,
})

export const fetchCategoriesSuccess = (state, { categories }) => ({
  ...state,
  categories,
  loadingCategories: false,
  errorMessage: null,
})

export const fetchCategoriesFailure = (state, { errorMessage }) => ({
  ...state,
  categories: [],
  loadingCategories: false,
  errorMessage,
})

export const fetchBranchLoading = (state) => ({
  ...state,
  loadingListBranch: true,
  errorMessage: null,
})

export const fetchBranchSuccess = (state, { listBranch }) => ({
  ...state,
  listBranch,
  loadingListBranch: false,
  errorMessage: null,
})

export const fetchBranchFailure = (state, { errorMessage }) => ({
  ...state,
  listBranch: [],
  loadingListBranch: false,
  errorMessage,
})

export const fetchProductsLoading = (state) => ({
  ...state,
  products: [],
  loadingProducts: true,
  errorMessage: null,
})

export const fetchProductsSuccess = (state, { products }) => ({
  ...state,
  products,
  loadingProducts: false,
  errorMessage: null,
})

export const fetchProductsFailure = (state, { errorMessage }) => ({
  ...state,
  products: [],
  loadingProducts: false,
  errorMessage,
})

export const fetchCategoriesBranchLoading = (state) => ({
  ...state,
  loadingCategoriesBranch: true,
  errorMessage: null,
})

export const fetchCategoriesBranchSuccess = (state, { categoriesBranch }) => ({
  ...state,
  categoriesBranch,
  loadingCategoriesBranch: false,
  errorMessage: null,
})

export const fetchCategoriesBranchFailure = (state, { errorMessage }) => ({
  ...state,
  categoriesBranch: [],
  loadingCategoriesBranch: false,
  errorMessage,
})

export const resetProduct = (state) => ({
  ...state,
  products: []
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [BranchTypes.FETCH_BRAND_LOADING]: fetchBrandLoading,
  [BranchTypes.FETCH_BRAND_SUCCESS]: fetchBrandSuccess,
  [BranchTypes.FETCH_BRAND_FAILURE]: fetchBrandFailure,
  [BranchTypes.FETCH_CATEGORIES_LOADING]: fetchCategoriesLoading,
  [BranchTypes.FETCH_CATEGORIES_SUCCESS]: fetchCategoriesSuccess,
  [BranchTypes.FETCH_CATEGORIES_FAILURE]: fetchCategoriesFailure,
  [BranchTypes.FETCH_BRANCH_LOADING]: fetchBranchLoading,
  [BranchTypes.FETCH_BRANCH_SUCCESS]: fetchBranchSuccess,
  [BranchTypes.FETCH_BRANCH_FAILURE]: fetchBranchFailure,
  [BranchTypes.FETCH_PRODUCTS_LOADING]: fetchProductsLoading,
  [BranchTypes.FETCH_PRODUCTS_SUCCESS]: fetchProductsSuccess,
  [BranchTypes.FETCH_PRODUCTS_FAILURE]: fetchProductsFailure,
  [BranchTypes.FETCH_CATEGORIES_BRANCH_LOADING]: fetchCategoriesBranchLoading,
  [BranchTypes.FETCH_CATEGORIES_BRANCH_SUCCESS]: fetchCategoriesBranchSuccess,
  [BranchTypes.FETCH_CATEGORIES_BRANCH_FAILURE]: fetchCategoriesBranchFailure,
  [BranchTypes.RESET_PRODUCT]: resetProduct,
})
