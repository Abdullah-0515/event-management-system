import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventsReducer from '../features/events/eventsSlice';
import registrationsReducer from '../features/registrations/registrationsSlice';

export const store = configureStore({
  reducer: { auth: authReducer, events: eventsReducer, registrations: registrationsReducer },
});

store.subscribe(() => {
  localStorage.setItem('registrations', JSON.stringify(store.getState().registrations.items));
});