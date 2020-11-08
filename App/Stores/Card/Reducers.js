/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState';
import { createReducer } from 'reduxsauce';
import { CardsTypes } from './Actions';

export const fetchCardsLoading = (state) => ({
  ...state,
  loadingCards: true,
  errorMessage: null,
})

export const fetchCardsSuccess = (state, { cards }) => ({
  ...state,
  cards,
  loadingCards: false,
  errorMessage: null,
})

export const fetchCardsFailure = (state, { errorMessage }) => ({
  ...state,
  cards: {},
  loadingCards: false,
  errorMessage,
})

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [CardsTypes.FETCH_CARDS_LOADING]: fetchCardsLoading,
  [CardsTypes.FETCH_CARDS_SUCCESS]: fetchCardsSuccess,
  [CardsTypes.FETCH_CARDS_FAILURE]: fetchCardsFailure,
})
