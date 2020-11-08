import { put, call, select } from 'redux-saga/effects';
import { processService } from '../Services/ProcessService';
import ProcessActions from '../Stores/Process/Actions'

export function* fetchProcess(action) {
  try {
    const response = yield call(processService.fetchProcess);
    if (response) {
      console.log('ok')
      const data = response.data && data !== null ? response.data : [];
      // console.log(data)
      yield put(ProcessActions.fetchProcessSuccess(data));
    } else {
      console.log('error1')
    }
  }catch (error) {
    console.log('error2')
  }
}