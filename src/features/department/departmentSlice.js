import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dept: [],
  department: ""
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.dept = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    addDepartment: (state, action) => {
      state.dept.push(action.payload);
    },
    clearDepartments: (state) => {
      state.dept = [];
    },
  },
});

export const { setDepartments, addDepartment,setDepartment, clearDepartments } = departmentSlice.actions;

export default departmentSlice.reducer;
