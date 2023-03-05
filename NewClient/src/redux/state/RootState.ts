import { combineReducers } from "redux";
import { AuthState } from "./AuthState";
import { authReducer } from "../reducers/AuthReducer";

export interface RootState {
  auth: AuthState;
}

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
