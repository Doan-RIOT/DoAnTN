import { Api } from './Api';
import axios from 'axios';

function fetchProcess() {
  const url = 'https://gist.githubusercontent.com/Doan-RIOT/d68ad817481c1db7efd1c3f340381118/raw/c5a59bc233fcb110b0b5b4fc00bd0dd1429162bd/HomeScreen.json';
  return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson
    })
    .catch((error) => {
      console.error(error);
    })
}

function fetchListProcess(data) {
  return Api.get('/project/list?page=0&size=5&all=false', false);
}

function fetchProcessDetail(idProcess) {
  return Api.get(`/project/detail/${idProcess}`, true);
}
export const processService = {
  fetchProcess,
  fetchProcessDetail,
  fetchListProcess
}