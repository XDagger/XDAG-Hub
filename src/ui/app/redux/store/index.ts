import { configureStore } from "@reduxjs/toolkit";
import { thunkExtras } from "./thunk-extras";
import { amplitudePersistenceMiddleware } from "../slices/account";
import rootReducer from "_redux/RootReducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: thunkExtras } }).prepend( amplitudePersistenceMiddleware.middleware, ),
});

export default store;

export type AppDispatch = typeof store.dispatch;
