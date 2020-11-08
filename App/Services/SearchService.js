import { Api } from './Api';

function search(data, language) {
  return Api.post(`/search?language=${language}`, data, true);
}

export const searchService = {
  search,
}
