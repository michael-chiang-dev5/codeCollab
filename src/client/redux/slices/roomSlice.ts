import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { setProperty } from './util';

interface Room {
  name: string;
}

const initialState: Room = {
  name: uuid(),
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    actionSetField: (state: Room, action) => {
      const field: keyof Room = action.payload.field;
      const value = action.payload.value;
      if (Object.keys(state).includes(field) === false) return; // validate field: don't do anything if invalid field. I don't know if this is actually necessary with typescript
      setProperty(state, field, value);
    },
  },
});

// Action creators are generated for each case reducer function
export const { actionSetField } = roomSlice.actions;

export default roomSlice.reducer;
