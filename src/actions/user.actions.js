import { userConstants } from '../constants';
import authApi from '../api/authApi';
import { alertActions } from './';
import auth from '../auth/authenticator';

// handle login form submit with username, password and query string
export function loginUser(credentials, querystrings) {
  return dispatch => {
    // handle login API call `api/authApi`
    return authApi.login(credentials, querystrings).then(response => {
      //console.log(response)
      var domainuniquekey;

      window.sessionStorage.setItem('domains', JSON.stringify(response.domains));
      if(domainuniquekey === undefined){
        domainuniquekey = response.domains[0].domainuniquekey;
        window.sessionStorage.setItem('domainuniquekey', response.domains[0].domainuniquekey);
      }else{
        domainuniquekey = domainuniquekey;
        window.sessionStorage.setItem('domainuniquekey', domainuniquekey);
        window.sessionStorage.setItem('storeuniquekey', response.storeinformation["storeuniquekey"]);
        window.sessionStorage.setItem('storename', response.storeinformation.name);
      }
      var userDetails = {};
      var userprofile = {};

      userDetails = credentials;
      userDetails["superadmin"] = response.superadmin;
      userDetails["domainadmin"] = response.domainadmin;
      userDetails["storeuser"] = response.storeuser;
      userDetails["domainuniquekey"] = domainuniquekey;

      window.sessionStorage.setItem('userDetails',JSON.stringify(userDetails));

      userprofile['userprofile'] = response.userprofile;

      window.sessionStorage.setItem('userDetails',JSON.stringify(userDetails));
      window.sessionStorage.setItem('userprofile',JSON.stringify(userprofile));

      window.sessionStorage.setItem('jwt', response.jwt);

    })

  }
}