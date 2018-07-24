import {combineReducers} from 'redux';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  // short hand property names
  sessionReducer
})

export default rootReducer;