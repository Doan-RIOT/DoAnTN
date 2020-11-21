import { Api } from './Api';
import axios from 'axios';

function fetchProcess() {
  const url = 'https://gist.githubusercontent.com/Doan-RIOT/d68ad817481c1db7efd1c3f340381118/raw/c5a59bc233fcb110b0b5b4fc00bd0dd1429162bd/HomeScreen.json';
  return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson)
        return responseJson
      })
      .catch((error) => {
        console.error(error);
      })
}
function fetchProcessDetail() {
  console.log('service')
  const url = 'https://gist.githubusercontent.com/Doan-RIOT/f5bbefa21f108bcfd99044b979a7ae90/raw/9201ad0013bf1586f67e8bc17f592e6fe047ce4c/data.json';
  return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('service',responseJson)
        return responseJson
      })
      .catch((error) => {
        console.error(error);
      })
}
export const processService = {
  fetchProcess,
  fetchProcessDetail
}