import { createSlice } from '@reduxjs/toolkit';
import { setProperty } from './util';

interface User {
  sub: string;
  picture: string;
  email: string;
  email_verified: boolean;
  _id: number;
}

const initialState: User = {
  sub: null,
  picture: null,
  email: null,
  email_verified: null,
  _id: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    actionSetField: (state: User, action) => {
      const field: keyof User = action.payload.field;
      const value = action.payload.value;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field
      setProperty(state, field, value);
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = userSlice.actions;

export default userSlice.reducer;
