import * as types from './actionTypes';
import sessionApi from '../api/SessionApi';
import auth from '../auth/authenticator';
import {browserHistory} from 'react-router';

export function loginUser(credentials, querystrings) {
  return function(dispatch) {
    dispatch(setLoginPending(true));
    dispatch(setLoginSuccess(false));
    dispatch(setLoginError(null));

    return sessionApi.login(credentials, querystrings).then(response => {
      console.log(response);
      dispatch(setLoginPending(false));

      if(response.statusCode == 200){

        dispatch(setLoginSuccess(true));
        window.sessionStorage.setItem('jwt', response.jwt);

        if(response.storeinformation !== undefined){
          window.sessionStorage.setItem('storeinformation', JSON.stringify(response.storeinformation));
        }

        window.sessionStorage.setItem('userdata', JSON.stringify(response));
        window.sessionStorage.setItem('accesslevelinfo', JSON.stringify(response.accesslevelinfo));
        window.sessionStorage.setItem('domains', JSON.stringify(response.domains));

        //if not passing domainuniquekey and storeunique from url
        if(querystrings.domainuniquekey === undefined){
          //get domainunique key from the response
          //domainuniquekey = response.domains.domainuniquekey;
          //window.sessionStorage.setItem('domainuniquekey', domainuniquekey);
        }else{
          //get domainunique key from query string variable
          var domainuniquekey = querystrings.domainuniquekey;
          window.sessionStorage.setItem('domainuniquekey', domainuniquekey);
          window.sessionStorage.setItem('storeuniquekey', response.storeinformation.storeuniquekey);
          window.sessionStorage.setItem('storename', response.storeinformation.name);
          window.sessionStorage.setItem('currentstorename', response.storeinformation.name);
        }

        window.sessionStorage.setItem('superadmin', response.superadmin);
        window.sessionStorage.setItem('domainadmin', response.domainadmin);
        window.sessionStorage.setItem('storeuser', response.storeuser);
        window.sessionStorage.setItem('credentials', JSON.stringify(credentials));

        var userDetails = {};
        var userprofile = {};

        userDetails = credentials;
        userDetails["superadmin"] = response.superadmin;
        userDetails["domainadmin"] = response.domainadmin;
        userDetails["storeuser"] = response.storeuser;
        //userDetails["domainuniquekey"] = domainuniquekey;

        window.sessionStorage.setItem('userDetails',JSON.stringify(userDetails));

        userprofile['userprofile'] = response.userprofile;

        window.sessionStorage.setItem('userDetails',JSON.stringify(userDetails));
        window.sessionStorage.setItem('userprofile',JSON.stringify(userprofile));

        window.sessionStorage.setItem('jwt', response.jwt);

        if(response.superadmin == true){
          browserHistory.push('/domains');
        }
        if(response.domainadmin == true){
          browserHistory.push('/stores');
        }
        if(response.storeuser == true){
          browserHistory.push('/dashboard')
        }

    }else{
      dispatch(setLoginError(response.statusMessage));
    }
    }).catch(error => {
      throw(error);
    });
  };
}

function setLoginPending(isLoginPending) {
  return {
    type: types.SET_LOGIN_PENDING,
    isLoginPending
  };
}

function setLoginSuccess(isLoginSuccess){
  return {
    type: types.SET_LOGIN_SUCCESS,
    isLoginSuccess
  }
}

function setLoginError(isLoginError){
  return {
    type: types.SET_LOGIN_ERROR,
    isLoginError
  }
}

export function logOutUser() {
  auth.logOut();
  return {type: types.LOG_OUT}
}