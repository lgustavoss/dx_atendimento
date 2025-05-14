import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import usersReducer from './slices/usersSlice';
import companiesReducer from './slices/companiesSlice';
import groupsReducer from './slices/groupsSlice';
import contactsReducer from './slices/contactsSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    companies: companiesReducer,
    groups: groupsReducer,
    contacts: contactsReducer,
    notification: notificationReducer,
    dashboard: dashboardReducer, // Adicionando o reducer do dashboard
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

