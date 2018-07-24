import axios from 'axios';

class SessionApi {
  static login(credentials, querystrings) {
    const auth = {};
    auth["username"] = credentials.username;
    auth["password"] = credentials.password;

    if(querystrings.domainuniquekey === undefined){
      //console.log('working')
      const request = new Request(`${process.env.API_HOST}/ManageCustomers.svc/CheckCustomerLogin/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(auth)
      });

      return fetch(request).then(response => {
        return response.json();
      }).catch(error => {
        return callback(new Error('Invalid email and password'));
      });
    }else{
      auth.domainuniquekey = querystrings.domainuniquekey;
      auth.storeuniquekey = querystrings.storeuniquekey;
      const request = new Request(`${process.env.API_HOST}/ManageUsers.svc/CheckUserLogin/json`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(auth)
      });
      return fetch(request).then(response => {
        return response.json();
      }).catch(error => {
        return callback(new Error('Invalid email and password'));
      });
    }
  }
}

export default SessionApi;