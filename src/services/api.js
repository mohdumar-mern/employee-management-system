import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Custom baseQuery with token from localStorage
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
  tagTypes: ["Departments", "Employees"],
  endpoints: (builder) => ({
    // 🔐 Login Admin
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
          console.error("Login failed:", error);
        }
      },
    }),

    // 🚪 Logout Admin
    logout: builder.mutation({
      query: () => ({ url: "/admin/logout", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("adminInfo");
          localStorage.removeItem("adminToken");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    // ➕ Add Department
    addDepartment: builder.mutation({
      query: (formData) => ({
        url: "/department",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Departments"],
    }),

    // 📄 Get All Departments
    getDepartments: builder.query({
      query: () => ({ url: "/department", method: "GET" }),
      providesTags: ["Departments"],
    }),

    // 📄 Get Department By ID
    getDepartmentById: builder.query({
      query: (id) => ({ url: `/department/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Departments", id }],
    }),

    // ❌ Delete Department By ID
    deleteDepartmentById: builder.mutation({
      query: (id) => ({ url: `/department/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Departments"],
    }),

    // ✅ Update Department By ID
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

    // ➕ Add Employee
    addEmployee: builder.mutation({
      query: (formData) => ({
        url: "/employee",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Employees"],
    }),

    // 📄 Get All Employees
    getEmployees: builder.query({
      query: () => ({ url: "/employee", method: "GET" }),
      providesTags: ["Employees"],
    }),

    // 📄 Get Employee By ID
    getEmployeeById: builder.query({
      query: (id) => ({ url: `/employee/${id}/view`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),

    // ❌ Delete Employee By ID
    deleteEmployeeById: builder.mutation({
      query: (id) => ({ url: `/employee/${id}/delete`, method: "DELETE" }),
      invalidatesTags: ["Employees"],
    }),
    // ✅ Update Employee By ID
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
      query: (id) => ({ url: `/employee/department/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
      keepUnusedDataFor: 0, // <-- disable cache immediately when unused
    }),

    // Add Salary
    addSalary: builder.mutation({
      query: (payload) => ({
        url: "/salary/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Employees"],
    }),

    // Get Employee Salary History by empID
    // 📄 Get Employee By ID
    getSalaryByEmpId: builder.query({
      query: (empId) => ({ url: `/salary/${empId}/history`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    
    }),
    
  }),
});

// ✅ Exporting RTK Query hooks
export const {
  useLoginMutation,
  useLogoutMutation,
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
  useAddSalaryMutation,
  useGetSalaryByEmpIdQuery,
} = api;
