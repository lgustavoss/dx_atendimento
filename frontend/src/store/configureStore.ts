import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import notificationSlice from './slices/notificationSlice';
import usersSlice from './slices/usersSlice';
import companiesSlice from './slices/companiesSlice';
import groupsSlice from './slices/groupsSlice';
import contactsSlice from './slices/contactsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    notification: notificationSlice,
    users: usersSlice,
    companies: companiesSlice,
    groups: groupsSlice,
    contacts: contactsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;