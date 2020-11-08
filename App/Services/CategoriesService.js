import { Api } from './Api';

function fetchProducts(data, language) {
  return Api.post(`/product/getbycategory?language=${language}`, data, true);
}

function fetchParentCategory(categoryId, language) {
  return Api.get(`/category/getbychild?categoryId=${categoryId}&&language=${language}`, true);
}

export const categoriesService = {
  fetchProducts,
  fetchParentCategory,
}
