import { createSlice } from '@reduxjs/toolkit';
import { setProperty } from './util';

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
      const field: keyof ReplStateType = action.payload.field;
      const value = action.payload.value;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field
      setProperty(state, field, value);
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = replSlice.actions;
export default replSlice.reducer;
