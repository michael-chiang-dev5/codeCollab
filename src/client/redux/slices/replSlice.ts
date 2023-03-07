import { createSlice } from '@reduxjs/toolkit';

const initialState: ReplStateType = {
  text: '',
};

interface ReplStateType {
  text: string;
}

export const replSlice = createSlice({
  name: 'repl',
  initialState,
  reducers: {
    actionSetField: (state, action) => {
      const { field, value } = action.payload;
      // validate field: don't do anything if invalid field
      if (Object.keys(state).includes(field) === false) return;
      state[field as keyof ReplStateType] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = replSlice.actions;

export default replSlice.reducer;
