import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-state-type
export type RootState = ReturnType<typeof store.getState>;
