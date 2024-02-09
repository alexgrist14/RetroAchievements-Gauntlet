import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  isLoading: boolean;
  isStarted: boolean;
  isFinished: boolean;
  segments: string[];
} = {
  isLoading: false,
  isStarted: false,
  isFinished: false,
  segments: Array(16).fill(""),
};

export const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setStarted: (state, action: PayloadAction<boolean>) => {
      state.isStarted = action.payload;
    },
    setFinished: (state, action: PayloadAction<boolean>) => {
      state.isFinished = action.payload;
    },
    setSegments: (state, action: PayloadAction<string[]>) => {
      state.segments = action.payload;
    },
  },
});

export const { setLoading, setStarted, setFinished, setSegments } =
  statesSlice.actions;
export default statesSlice.reducer;