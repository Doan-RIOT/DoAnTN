import { Api } from './Api';
import axios from 'axios';

function fetchProcess() {
  const url = 'https://gist.githubusercontent.com/Doan-RIOT/f5bbefa21f108bcfd99044b979a7ae90/raw/8bb3e9348ca5ad4d6987c7fffcb222838c3d0c70/data.json';
  const res = axios.get(url).then(function(response){
    return response.json() ;
  })
  console.log("get ok")
  return res ;
  
}
export const processService = {
  fetchProcess
}