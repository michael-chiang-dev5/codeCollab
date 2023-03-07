import { createSlice } from '@reduxjs/toolkit';

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
      const { field, value } = action.payload;
      // validate field: don't do anything if invalid field
      if (Object.keys(state).includes(field) === false) return;
      state[field as keyof MarkdownStateType] = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = markdownSlice.actions;

export default markdownSlice.reducer;
