import { Api } from './Api';

function login(data) {
  return Api.post('/login', data, false);
}

function logOut() {
  return Api.get('/logout', true);
}

function fetchProfile(userId, language) {
  return Api.get(`/customer/profile?customerId=${userId}&language=${language}`, true);
}

function fetchAddress(userId, language) {
  return Api.get(`/customer/address?customerId=${userId}&language=${language}`, true);
}

function fetchLocation() {
  return Api.get(`/location`, false);
}

function updateProfile(data, language) {
  return Api.post(`/customer/update?language=${language}`, data, true);
}

function updateAddress(data, language) {
  return Api.post(`/customer/address/update?language=${language}`, data, true);
}

function deleteAddress(data, language) {
  return Api.post(`/customer/address/delete?language=${language}`, data, true);
}

function uploadImage(data) {
  return Api.post(`/upload/readFiles`, data, true, true);
}

function fetchHistoriesOrder(userId, language) {
  return Api.get(`/orders?customerId=${userId}&language=${language}`, true);
}

function fetchDetailsHistoryOrder(orderId, language) {
  return Api.get(`/orders/detail?orderId=${orderId}&language=${language}`, true);
}

function signUp(data) {
  return Api.post(`/customer/create`, data, false);
}

function favorites(data) {
  return Api.post(`/customer/favorites`, data, true);
}

function fetchPromotion(userId, language) {
  return Api.get(`/customer/promotions?customerId=${userId}&language=${language}`, true);
}

function fetchFavorites(userId, language) {
  return Api.get(`/customer/favorites?customerId=${userId}&language=${language}`, true);
}

function updateOrders(data) {
  return Api.post(`/orders/status/update`, data, true);
}

function saveToken(data) {
  return Api.post(`/firebase/token`, data, true);
}

function changePassword(data, language) {
  return Api.post(`/customer/update/password?language=${language}`, data, true);
}

function returnOrder(data, language) {
  return Api.post(`/orders/returnOrder?language=${language}`,data, true);
}

export const userService = {
  login,
  logOut,
  signUp,
  fetchProfile,
  updateProfile,
  fetchAddress,
  fetchLocation,
  updateAddress,
  deleteAddress,
  uploadImage,
  fetchHistoriesOrder,
  fetchDetailsHistoryOrder,
  favorites,
  fetchPromotion,
  fetchFavorites,
  updateOrders,
  saveToken,
  changePassword,
  returnOrder
}
