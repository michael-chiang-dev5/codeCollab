import { createSlice } from '@reduxjs/toolkit';
import { setProperty } from './util';

const initialState: Repl = {
  text: '',
};

interface Repl {
  text: string;
}

export const replSlice = createSlice({
  name: 'repl',
  initialState,
  reducers: {
    actionSetField: (state, action) => {
      const field: keyof Repl = action.payload.field;
      const value = action.payload.value;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field
      setProperty(state, field, value);
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = replSlice.actions;
export default replSlice.reducer;
