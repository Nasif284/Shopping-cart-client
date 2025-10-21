import { adminApi } from "../setup/AdminBaseApi";

export const homeSlidesApi = adminApi.injectEndpoints({
    endpoints: (builder) => ({
        addHomeSlides: builder.mutation({
            query: (data) => ({
                url: "/homeSlides/",
                method: "post",
                body: data
            })
        })
    })
})

export const {useAddHomeSlidesMutation} = homeSlidesApi