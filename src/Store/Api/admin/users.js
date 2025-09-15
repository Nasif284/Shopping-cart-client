import { adminApi } from "../setup/AdminBaseApi";

export const userManagementApi = adminApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users/",
        method: "get",
      }),
      providesTags: ["Users"],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/users/block/${id}`,
        method: "post",
      }),
      invalidatesTags: ["Users"],
    }),

  }),
});

export const { useGetUsersQuery, useBlockUserMutation } = userManagementApi;
