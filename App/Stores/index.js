import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from 'App/Sagas';
import { reducer as UserReducer } from './User/Reducers';
import { reducer as BranchReducer } from './Branch/Reducers';
import { reducer as CategoriesReducer } from './Categories/Reducers';
import { reducer as CardsReducer } from './Card/Reducers';
import { reducer as CartReducer } from './Cart/Reducers';
import { reducer as ProcessReducer } from './Process/Reducers';
export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    user: UserReducer,
    branch: BranchReducer,
    categories: CategoriesReducer,
    cards: CardsReducer,
    cart: CartReducer,
    process: ProcessReducer
  })

  return configureStore(rootReducer, rootSaga)
}
