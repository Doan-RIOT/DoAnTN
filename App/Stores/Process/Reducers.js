import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { ProcessTypes } from './Actions';

export const fetchProcessSuccess = (state,{process}) => ({
    ...state,
    process,
    number : true
}) 
export const reducer = createReducer(INITIAL_STATE, {

    [ProcessTypes.FETCH_PROCESS_SUCCESS]: fetchProcessSuccess
})