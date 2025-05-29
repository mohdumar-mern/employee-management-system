import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salary: [],
  success: false,
  message: "",
};

const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    setSalary: (state, action) => {
      state.salary = action.payload.salary;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    resetSalaryState: () => ({
      ...initialState, // reset without mutating directly
    }),
  },
});

export const { setSalary, resetSalaryState } = salarySlice.actions;
export default salarySlice.reducer;
