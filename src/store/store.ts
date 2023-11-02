import { combineReducers, createStore } from "redux";
import { Institute, User } from "./types";

interface State {
  user: User;
  institutes: Institute[];
}

const initialState: State = {
  user: {
    email: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    certificateCode: "",
    password: "",
    login: "",
    isLoggedIn: false,
  },
  institutes: [],
};

export const userReducer = (
  state: User = initialState.user,
  action: any
): User => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const institutesReducer = (
  state: Institute[] = initialState.institutes,
  action: any
): Institute[] => {
  switch (action.type) {
    case "ADD_INSTITUTE":
      return [...state, action.payload];
    case "REMOVE_INSTITUTE":
      return state.filter(
        (institute) => institute.name !== action.payload.name
      );
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  institutes: institutesReducer,
});

export const store = createStore(rootReducer);
