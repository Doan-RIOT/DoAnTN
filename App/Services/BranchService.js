import { Api } from './Api';

function fetchBrand(categoryIds, city, language) {
  return Api.get(`/brand?language=${language}&categoryIds=${categoryIds !== null ? categoryIds.toString() : ''}&city=${city !== null ? city : ''}`, true);
}

function fetchCategories(language) {
  return Api.get(`/category?language=${language}`, true);
}

function fetchBranch(brandId, language) {
  return Api.get(`/branch?brandId=${brandId}&language=${language}`, true);
}

function fetchProducts(branchId, language) {
  return Api.get(`/product/getbybranch?branchId=${branchId}&language=${language}`, true);
}

function fetchCategoriesBranch(branchId, language) {
  return Api.get(`/category/getbybranch?branchId=${branchId}&language=${language}`, true);
}

function createComment(data, language) {
  return Api.post(`/comment/product/create?language=${language}`, data, true);
}

function fetchProductById(productId, productCode, branchId, language) {
  return Api.get(`/product/detail?productId=${productId}&productCode=${productCode}&branchId=${branchId}&language=${language}`, true);
}

export const branchService = {
  fetchBrand,
  fetchCategories,
  fetchBranch,
  fetchProducts,
  fetchCategoriesBranch,
  createComment,
  fetchProductById
}
