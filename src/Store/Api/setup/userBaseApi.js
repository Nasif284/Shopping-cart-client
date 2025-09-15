import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBase";
import userInstance from "./Instances/userInstance";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "/api/user",
    instance: userInstance, 
  }),
  endpoints: () => ({}),
  tagTypes: ["Auth", "Product", "Cart", "Order", "Users"],
});
