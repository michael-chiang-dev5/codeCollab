import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import replReducer from './slices/replSlice';
import markdownReducer from './slices/markdownSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    repl: replReducer,
    markdown: markdownReducer,
  },
});

// see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-state-type
export type RootState = ReturnType<typeof store.getState>;
