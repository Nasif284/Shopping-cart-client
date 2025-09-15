import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./StoreSlices/uiSlice";

import userAuthSlice from "./StoreSlices/userAuthSlice";
import adminAuthSlice from "./StoreSlices/adminAuthSlice";
import { userApi } from "./Api/setup/userBaseApi";
import { adminApi } from "./Api/setup/AdminBaseApi";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    ui: uiReducer,
    userAuth: userAuthSlice,
    adminAuth: adminAuthSlice,
  },
  middleware: (getDefault) => [
    ...getDefault(),
    userApi.middleware,
    adminApi.middleware,
  ],
});
