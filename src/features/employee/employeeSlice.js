import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  employee: null,
  message: "",
  success: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload.employees;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp._id !== action.payload);
    },
  },
});

export const { setEmployees, removeEmployee } = employeeSlice.actions;

// export const selectEmployees = (state) => state.employee.employees;

export default employeeSlice.reducer;
