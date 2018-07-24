import axios from 'axios';

class authApi {
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
        return error;
      });
    }else{
      auth.domainuniquekey = querystrings.domainuniquekey;
      auth.storeuniquekey = querystrings.storeuniquekey;
      console.log(auth)
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
        return error;
      });
    }
  }
}

export default authApi;