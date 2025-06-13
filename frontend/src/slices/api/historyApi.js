import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    /**
     * Save a single test run to history
     * @param {{
     *  testType: "manual" | "collection",
     *  testName: string,
     *  request: {
     *    name: string,
     *    method: string,
     *    url: string,
     *    body?: any,
     *    headers?: { [key: string]: string }
     *  },
     *  response: {
     *    status: number,
     *    data: any,
     *    duration: number,
     *    isSuccess: boolean,
     *    warning?: string,
     *    errorSummary?: string
     *  }
     * }} data
     */
    saveTestHistory: builder.mutation({
      query: (data) => ({
        url: "/history/save-history",
        method: "POST",
        body: data,
      }),
    }),
    getTestHistory: builder.query({
      query: () => ({
        url: "/history/get-history",
        method: "GET",
      }),
    }),
    getHistoryById: builder.query({
      query: (id) => ({
        url: `/history/${id}`,
        method: "GET",
      }),
    }),
    deleteTestHistory: builder.mutation({
      query: (data) => ({
        url: "/history/delete-history",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useSaveTestHistoryMutation,
  useGetTestHistoryQuery,
  useDeleteTestHistoryMutation,
  useGetHistoryByIdQuery,
} = historyApi;
