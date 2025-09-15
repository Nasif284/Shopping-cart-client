import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBase";
import adminInstance from "./Instances/adminInstance";
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/admin",
    instance: adminInstance,
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "Product",
    "Variants",
    "Category",
    "Size",
    "Cart",
    "Order",
    "Users",
  ],
});
