export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

export interface User {
  certificateCode: string;
  email: string;
  password: string;
  fullName: string;
  graduationYear: string;
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

export interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: User;
}

export type AuthActionTypes =
  | LoginSuccessAction
  | LogoutSuccessAction
  | RegisterSuccessAction;
