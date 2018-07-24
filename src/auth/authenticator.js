class Auth {
  static loggedIn() {
    return !!sessionStorage.jwt;
  }

  static logOut() {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('domains');
    sessionStorage.removeItem('superadmin');
    sessionStorage.removeItem('domainadmin');
    sessionStorage.removeItem('storeuser');
  }
}

export default Auth;