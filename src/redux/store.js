import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
// import { counterSlice } from "./slice/counterSlice";
// import { Auth } from "./AuthSlice";

// import Auth from "./Auth";
// import AuthenticationSlice from "./AuthenticationSlice";
// import groupSlice from "./groupSlice";
// import ProfileSlice from "./ProfileSlice";
// import { walletApi } from "./WalletApi";
// import { orderApi, groupOrderApi } from "./orderApi";
// import { passwordResetApi } from "./PasswordResetApi";
// import { categoryApi } from "./categoryApi";
// import { groupApi } from "./groupApi";
// import { userApi } from "./userApi";
// import ProductSlice from "./ProductSlice";
// import OrderSlice from "./OrderSlice";
// import AdminRecipteSLice from "./AdminRecipteSLice";

// AuthSlice

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

const rootReducer = (state, action) => {
  if (action.type === "RESET") {
    storage.removeItem("persist:root");
    state = {};
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
