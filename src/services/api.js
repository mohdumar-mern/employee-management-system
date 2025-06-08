// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Departments", "Employees", "Leaves", "Salary"],
  endpoints: (builder) => ({
    // Admin Auth
    login: builder.mutation({
      query: (formData) => ({
        url: "/admin/login",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.token) {
            localStorage.setItem("adminInfo", JSON.stringify(data.user));
            localStorage.setItem("adminToken", data.token);
          }
        } catch (error) {
          console.error(error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({ url: "/admin/logout", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("adminInfo");
          localStorage.removeItem("adminToken");
        } catch (error) {
          console.error(error);
        }
      },
    }),
    // admin forgot password
    adminForgotPassword: builder.mutation({
      query: ({  id, oldPassword, newPassword }) => ({
        url: `/admin/${id}/forgot-password`,
        method: "PUT",
        body: { oldPassword, newPassword },
      }),
    }),

    // Employee Forgot Password
    forgotPassword: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/user/${id}/forgot-password`,
        method: "PUT",
        body: formData,
      }),
    }),

    // Department APIs
    addDepartment: builder.mutation({
      query: (payload) => ({
        url: "/department",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Departments"],
    }),
    getDepartments: builder.query({
      query: () => ({ url: "/department", method: "GET" }),
      providesTags: ["Departments"],
    }),
    getDepartmentById: builder.query({
      query: (id) => ({ url: `/department/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Departments", id }],
    }),
    deleteDepartmentById: builder.mutation({
      query: (id) => ({ url: `/department/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartmentById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/department/${id}/edit`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Departments", id },
        "Departments",
      ],
    }),

    // Employee APIs
    addEmployee: builder.mutation({
      query: (payload) => ({ url: "/employee", method: "POST", body: payload }),
      invalidatesTags: ["Employees"],
    }),
    getEmployees: builder.query({
      query: () => ({ url: "/employee", method: "GET" }),
      providesTags: ["Employees"],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({ url: `/employee/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),
    deleteEmployeeById: builder.mutation({
      query: (id) => ({ url: `/employee/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployeeById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/employee/${id}/edit`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employees", id },
        "Employees",
      ],
    }),
    getEmployeeByDepartment: builder.query({
      query: (depId) => ({
        url: `/employee/department/${depId}`,
        method: "GET",
      }),
      providesTags: (result, error, depId) => [
        { type: "Employees", id: depId },
      ],
      keepUnusedDataFor: 0,
    }),

    // Salary APIs
    getSalary: builder.query({
      query: () => ({ url: "/salary", method: "GET" }),
      providesTags: ["Salaries"],
    }),
    addSalary: builder.mutation({
      query: (payload) => ({
        url: "/salary/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Salary"],
    }),
    getSalaryByEmpId: builder.query({
      query: (empId) => ({ url: `/salary/${empId}/history`, method: "GET" }),
      providesTags: (result, error, empId) => [{ type: "Salary", id: empId }],
    }),

    // Leave APIs
    addLeave: builder.mutation({
      query: (payload) => ({
        url: "/leave/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Leaves"],
    }),
    getLeaveHistory: builder.query({
      query: () => ({ url: "/leave/employee", method: "GET" }),
      providesTags: ["Leaves"],
    }),
    getAdminAllLeaves: builder.query({
      query: () => ({ url: "/leave", method: "GET" }),
      providesTags: ["Leaves"],
    }),
    getLeaveById: builder.query({
      query: (id) => ({ url: `/leave/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "leave", id }],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/leave/${id}/update-status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Leaves"],
    }),
    getEmployeeLeavesByEmployeeId: builder.query({
      query: (id) => ({ url: `/leave/${id}/leaves`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Leaves", id }],
    }),

    dashboardSummary: builder.query({
      query: () => ({url: "/dashboard/summary", method: "GET"}),
    })
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAdminForgotPasswordMutation,

  useForgotPasswordMutation,
  useAddDepartmentMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useDeleteDepartmentByIdMutation,
  useUpdateDepartmentByIdMutation,

  useAddEmployeeMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useDeleteEmployeeByIdMutation,
  useUpdateEmployeeByIdMutation,
  useGetEmployeeByDepartmentQuery,

  useGetSalaryQuery,
  useAddSalaryMutation,
  useGetSalaryByEmpIdQuery,

  useAddLeaveMutation,
  useGetLeaveHistoryQuery,
  useGetAdminAllLeavesQuery,
  useGetLeaveByIdQuery,
  useUpdateLeaveStatusMutation,
  useGetEmployeeLeavesByEmployeeIdQuery,

  useDashboardSummaryQuery
} = api;
