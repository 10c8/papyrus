import { readable } from 'svelte/store';
import { configureStore } from '@reduxjs/toolkit';

import appSlice from './slices/appSlice';

export const reduxStore = configureStore({
  reducer: {
    app: appSlice
  }
});

const bindReduxStore = store => {
  const state = readable(store.getState(), set => {
    const unsubscribe = store.subscribe(() => {
      set(store.getState());
    });

    return unsubscribe;
  });

  return {
    subscribe: state.subscribe,
    dispatch: store.dispatch
  };
};

export const store = bindReduxStore(reduxStore);
