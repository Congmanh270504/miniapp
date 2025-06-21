import { configureStore } from "@reduxjs/toolkit";
import modifyItemReducer from "./modify/modifyItem";

export const store = configureStore({
  reducer: {
    modifyItem: modifyItemReducer,
  },
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
