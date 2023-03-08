import { createSlice } from '@reduxjs/toolkit';
import { setProperty } from './util';

const initialState: MarkdownStateType = {
  str: '',
};

interface MarkdownStateType {
  str: string;
}

export const markdownSlice = createSlice({
  name: 'markdown',
  initialState,
  reducers: {
    actionSetField: (state, action) => {
      const field: keyof MarkdownStateType = action.payload.field;
      const value = action.payload.value;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field. I don't know if this is actually necessary with typescript
      setProperty(state, field, value);
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = markdownSlice.actions;

export default markdownSlice.reducer;
