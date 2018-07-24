import * as types from '../actions/actionTypes';
//import initialState from './initialState';
import {browserHistory} from 'react-router';

//export default function sessionReducer(state = initialState.session, action) {
  export default function sessionReducer(state = {
    isLoginSuccess: false,
    isLoginPending: false,
    loginError: null
  }, action) {

    switch(action.type) {
      case types.SET_LOGIN_PENDING:
        return Object.assign({}, state, {
          isLoginPending: action.isLoginPending
        });

      case types.SET_LOGIN_SUCCESS:
        return Object.assign({}, state, {
          isLoginSuccess: action.isLoginSuccess
        });
        return !!sessionStorage.jwt;

      case types.SET_LOGIN_ERROR:
        return Object.assign({}, state, {
          isLoginError: action.isLoginError
        });

      case types.LOG_OUT:
        browserHistory.push('/')
        return !!sessionStorage.jwt;

    default:
      return state;
  }
}
