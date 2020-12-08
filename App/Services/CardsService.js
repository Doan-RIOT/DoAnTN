import { Api } from './Api';

function fetchCards(customerId, language) {
  return Api.get(`/customer/point?customerId=${customerId}&language=${language}`, true);
}
function fetchProject() {
  return Api.get('/project/listByUser?type=ACTUAL&is_finished=false', true);
}
export const cardsService = {
  fetchCards,
  fetchProject
}
