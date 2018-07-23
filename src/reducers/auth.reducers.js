import { authConstants } from '../constants';

const initialState = {
    isAuthenticated: false,
    isLoginPending: false,
    loginError: null,
    isLoginSuccess: false,
    user: [],
};

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        case authConstants.SET_LOGIN_PENDING:
            return {...state,
                isLoginPending: action.isLoginPending
            }
        case authConstants.LOGIN_SUCCESS:
            return {...state,
                isLoginSuccess: action.isLoginSuccess
            }
        case authConstants.LOGIN_FAILURE:
            return {...state,
                loginError: action.loginError
            }
        case authConstants.SET_CURRENT_USER:
            return {...state,
                user: action.user
            }
        default:
            return state;
    }
}
export default authReducer;