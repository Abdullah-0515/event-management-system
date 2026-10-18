import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('registrations') || '[]');

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: { items: saved, message: null },
  reducers: {
    registerForEvent(state, { payload: { userEmail, event } }) {
      const exists = state.items.some((r) => r.userEmail === userEmail && r.event.id === event.id);
      if (exists) {
        state.message = { type: 'error', text: 'You are already registered for this event.' };
        return;
      }
      state.items.push({ userEmail, event, registeredAt: new Date().toISOString() });
      state.message = { type: 'success', text: 'Registered successfully!' };
    },
    cancelRegistration(state, { payload: { userEmail, eventId } }) {
      state.items = state.items.filter((r) => !(r.userEmail === userEmail && r.event.id === eventId));
      state.message = { type: 'success', text: 'Registration cancelled.' };
    },
    clearMessage(state) { state.message = null; },
  },
});

export const { registerForEvent, cancelRegistration, clearMessage } = registrationsSlice.actions;
export default registrationsSlice.reducer;