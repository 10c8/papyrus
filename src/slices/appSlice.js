import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    counter: 0
  },
  reducers: {
    incrementCounter: state => {
      state.counter++;
    },

    decrementCounter: state => {
      state.counter--;
    },

    setCounter: (state, action) => {
      state.counter = action.payload;
    }
  }
});

export const {
  incrementCounter,
  decrementCounter,
  setCounter
} = appSlice.actions;

export default appSlice.reducer;
