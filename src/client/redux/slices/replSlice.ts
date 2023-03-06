import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: '',
};

export const replSlice = createSlice({
  name: 'repl',
  initialState,
  reducers: {
    actionSetField: (state, action) => {
      const { field, value } = action.payload;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field
      state[field] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = replSlice.actions;

export default replSlice.reducer;
