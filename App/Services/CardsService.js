import Axios from 'axios';
import { Api } from './Api';
import { Config } from "App/Config";
function fetchCards(customerId, language) {
  return Api.get(`/customer/point?customerId=${customerId}&language=${language}`, true);
}
function fetchProject() {
  return Api.get('/project/listByUser?type=ACTUAL&is_finished=false', true);
}
function createTask(data) {
  return Api.post('/task/create',
  { 
    phaseId: data.phaseId, 
    name: data.name,
    description: data.description,
    estimatedTime: data.estimatedTime,
    estimatedTimeUnit: data.estimatedTimeUnit,
    workerNum: data.workerNum,
    workerUnitFee: data.workerUnitFee,
    isDailyTask: data.isDailyTask,
  }, true);
}
function createMaterial(data) {
  return Api.post('/material/create',data, true);
}
function createMeasurements(data) {
  return Api.post('/measurement/create',data, true);
}
function updateMeasurements (data,token) {
  return Axios.put(`${Config.API_URL}/measurement/update`, {
    "_id": data._id, 
    "realityNum":  parseInt(data.realityNum)
  }, {
  headers: {"Authorization": `Bearer ${token}`}
})
}

function updateProject (data,token) {
  return Axios.put(`${Config.API_URL}/project/update`, {
    "_id": data._id, 
    "planStartDate": data.planStartDate,
    "address": data.address
  }, {
  headers: {"Authorization": `Bearer ${token}`}
})
}
function updateProjectEnd (data,token) {
  return Axios.put(`${Config.API_URL}/project/update`, {
    "_id": data._id, 
    "isFinished": data.isFinished,
  }, {
  headers: {"Authorization": `Bearer ${token}`}
})
}

function updateTask (data,token) {
  return Axios.put(`${Config.API_URL}/task/update`, {
    "_id": data._id, 
    "note": data.note
  }, {
  headers: {"Authorization": `Bearer ${token}`}
})
}

function updateMaterial (data,token) {
  console.log(data)
  return Axios.put(`${Config.API_URL}/material/update`,data, {
  headers: {"Authorization": `Bearer ${token}`}
})
}

export const cardsService = {
  fetchCards,
  fetchProject,
  createTask,
  updateMeasurements,
  updateMaterial,
  createMaterial,
  createMeasurements,
  updateProject,
  updateTask,
  updateProjectEnd
}
