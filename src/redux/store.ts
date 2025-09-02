import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import AuthSlice from "./AuthSlice";
import estateSlice from "./estateSlice";

const reducers = combineReducers({
  AuthSlice: AuthSlice,
  estateSlice: estateSlice,
  //   counterSlice: counterSlice,
  //   AuthenticationSlice: AuthenticationSlice,
  //   groupSlice: groupSlice,
  //   ProfileSlice: ProfileSlice,
  //   ProductSlice: ProductSlice,
  //   OrderSlice: OrderSlice,
  //   AdminRecipteSLice: AdminRecipteSLice,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
};

type StateType = ReturnType<typeof reducers>;

const rootReducer = (state: StateType | undefined, action: any): StateType => {
  if (action.type === "RESET") {
    storage.removeItem("persist:root");
    state = undefined;
  }
  return reducers(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    reducer: persistedReducer,
    // [walletApi.reducerPath]: walletApi.reducer,
    // [passwordResetApi.reducerPath]: passwordResetApi.reducer,
    // [orderApi.reducerPath]: orderApi.reducer,
    // [groupOrderApi.reducerPath]: groupOrderApi.reducer,
    // [userApi.reducerPath]: userApi.reducer,
    // [categoryApi.reducerPath]: categoryApi.reducer,
    // [groupApi.reducerPath]: groupApi.reducer,
  },
  //   devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false })
      .concat
      //   walletApi.middleware,
      //   passwordResetApi.middleware,
      //   orderApi.middleware,
      //   groupOrderApi.middleware,
      //   categoryApi.middleware,
      //   groupApi.middleware,
      //   userApi.middleware
      ();
  },
  //   passwordResetApi,
});

export const persistor = persistStore(store);

// RootState type for use in selectors
export type RootState = ReturnType<typeof store.getState>;
