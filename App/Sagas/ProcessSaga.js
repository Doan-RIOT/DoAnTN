import { put, call, select } from 'redux-saga/effects';
import { processService } from '../Services/ProcessService';
import ProcessActions from '../Stores/Process/Actions'

export function* fetchProcess(action) {
  try {
    const response = yield call(processService.fetchProcess);
    if (response) {
      // console.log('ok')
      const data = response.data && data !== null ? response.data : [];
      // console.log(data)
      yield put(ProcessActions.fetchProcessSuccess(response));
    } else {
      console.log('error1')
    }
  }catch (error) {
    console.log('error2')
  }
}

export function* fetchProcessDetail(action) {
  try {
    // console.log('ok1')
    const response = yield call(processService.fetchProcessDetail);
      // console.log('saga',response)
    if (response) {
      
      // const data = response.data && data !== null ? response.data : [];
      // console.log(data)
      yield put(ProcessActions.fetchProcessDetailSuccess(response));
    } else {
      console.log('error1')
    }
  }catch (error) {
    console.log('error2')
  }
}