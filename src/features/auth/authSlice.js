import { createSlice } from '@reduxjs/toolkit';

const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: savedUser, error: null },
  reducers: {
    register(state, { payload }) {
      const users = getUsers();
      if (users.some((u) => u.email === payload.email)) {
        state.error = 'This email is already registered';
        return;
      }
      users.push(payload);
      localStorage.setItem('users', JSON.stringify(users));
      const safeUser = { ...payload }; delete safeUser.password;
      state.user = safeUser;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
    },
    login(state, { payload }) {
      const found = getUsers().find(
        (u) => u.email === payload.email && u.password === payload.password
      );
      if (!found) {
        state.error = 'Invalid email or password';
        return;
      }
      const safeUser = { ...found }; delete safeUser.password;
      state.user = safeUser;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('currentUser');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;