import { authConstants } from '../constants';
function setLoginPending(isLoginPending) {
    return {
      type: types.SET_LOGIN_PENDING,
      isLoginPending
    };
  }

export function login(data) {
    return dispatch => {
        dispatch(setLoginPending(true));
    }
}