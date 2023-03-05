import { AuthState } from "../state/AuthState";
import {
  AuthActionTypes,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
} from "../types/AuthTypes";

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};
export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGOUT_SUCCESS:
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
