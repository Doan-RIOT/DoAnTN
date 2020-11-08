import { Api } from './Api';

function createOrders(data, language) {
  return Api.post(`/orders?language=${language}`, data, true);
}

function createOrdersAnonymous(data, language) {
  return Api.post(`/orders/anonymous?language=${language}`, data, true);
}

function fetchCart(customerId, language) {
  return Api.get(`/orders/cart?customerId=${customerId}&language=${language}`, true);
}

export const cartService = {
  createOrders,
  createOrdersAnonymous,
  fetchCart,
}
