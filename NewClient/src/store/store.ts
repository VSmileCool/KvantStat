import { createStore, combineReducers } from "redux";

// Import reducers
import userReducer from "./reducers/userReducer";

// Define the root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

// Define the root state type
export type RootState = ReturnType<typeof rootReducer>;

// Create the store
const store = createStore(rootReducer);

export default store;
