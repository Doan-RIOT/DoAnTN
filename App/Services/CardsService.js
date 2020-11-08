import { Api } from './Api';

function fetchCards(customerId, language) {
  return Api.get(`/customer/point?customerId=${customerId}&language=${language}`, true);
}

export const cardsService = {
  fetchCards,
}
