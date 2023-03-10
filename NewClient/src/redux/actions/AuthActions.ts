import { ThunkAction } from "redux-thunk";
import { RootState } from "../state/RootState";
import {
  AuthActionTypes,
  LOGIN_SUCCESS,
  LoginSuccessAction,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
} from "../types/AuthTypes";
import { authService, User } from "../../http/auth";

export const login = (email: string, password: string) => {
  return authService.login(email, password);
};

export const logout = (): ThunkAction<
  void,
  RootState,
  null,
  AuthActionTypes
> => {
  return async (dispatch) => {
    await authService.logout();
    dispatch({ type: LOGOUT_SUCCESS });
  };
};

export const register = (user: {
  email: string;
  password: string;
  certificateCode: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  graduationYear: string;
}): ThunkAction<void, RootState, null, AuthActionTypes> => {
  return async (dispatch) => {
    const registeredUser = await authService.register(user);
    dispatch({ type: REGISTER_SUCCESS, payload: registeredUser });
  };
};
