import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { initialState } from './initialState';
import { reducer as postsReducer } from './postsRedux';

/* DEFINE REDUCERS */
const reducers = {
  posts: postsReducer,
};

/* ADD BLANK REDUCERS FOR INITIAL STATE PROPERTIES WITHOUT REDUCERS */
Object.keys(initialState).forEach(item => {
  if (typeof reducers[item] == 'undefined') {
    reducers[item] = (statePart = null) => statePart;
  }
});

const combinedReducers = combineReducers(reducers);

/* CREATE STORE */
export const store = createStore(
  combinedReducers,
  initialState,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
);
