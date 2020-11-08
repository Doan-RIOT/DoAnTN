/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { CategoriesTypes } from './Actions';

export const fetchProductsByCategoryLoading = (state) => ({
  ...state,
  loadingProductsCategory: true,
  errorMessage: null,
})

export const fetchProductsByCategorySuccess = (state, { productsCategory }) => ({
  ...state,
  categories: productsCategory.category ? productsCategory.category : [],
  products: productsCategory.product && productsCategory.product.product ? productsCategory.product.product : [],
  loadingProductsCategory: false,
  errorMessage: null,
})

export const fetchProductsByCategoryFailure = (state, { errorMessage }) => ({
  ...state,
  categories: [],
  products: [],
  loadingProductsCategory: false,
  errorMessage,
})

export const fetchParentCategoryLoading = (state) => ({
  ...state,
  loadingCategory: true,
  errorMessage: null,
})

export const fetchParentCategorySuccess = (state, { categories }) => ({
  ...state,
  categories,
  loadingCategory: false,
  errorMessage: null,
})

export const fetchParentCategoryFailure = (state, { errorMessage }) => ({
  ...state,
  loadingCategory: false,
  errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [CategoriesTypes.FETCH_PRODUCTS_BY_CATEGORY_LOADING]: fetchProductsByCategoryLoading,
  [CategoriesTypes.FETCH_PRODUCTS_BY_CATEGORY_SUCCESS]: fetchProductsByCategorySuccess,
  [CategoriesTypes.FETCH_PRODUCTS_BY_CATEGORY_FAILURE]: fetchProductsByCategoryFailure,
  [CategoriesTypes.FETCH_PARENT_CATEGORY_LOADING]: fetchParentCategoryLoading,
  [CategoriesTypes.FETCH_PARENT_CATEGORY_SUCCESS]: fetchParentCategorySuccess,
  [CategoriesTypes.FETCH_PARENT_CATEGORY_FAILURE]: fetchParentCategoryFailure,
})
