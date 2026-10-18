import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventsApi, fetchEventByIdApi, fetchClassificationsApi } from '../../services/ticketmaster';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (params, { rejectWithValue }) => {
  try { return await fetchEventsApi(params); } catch (e) { return rejectWithValue(e.message); }
});
export const fetchEventDetails = createAsyncThunk('events/fetchEventDetails', async (id, { rejectWithValue }) => {
  try { return await fetchEventByIdApi(id); } catch (e) { return rejectWithValue(e.message); }
});
export const fetchCategories = createAsyncThunk('events/fetchCategories', async (_, { rejectWithValue }) => {
  try { return await fetchClassificationsApi(); } catch (e) { return rejectWithValue(e.message); }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [], page: null, status: 'idle', error: null,
    selected: null, selectedStatus: 'idle', selectedError: null,
    categories: [],
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchEvents.pending, (s) => { s.status = 'loading'; s.error = null; })
     .addCase(fetchEvents.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload.events; s.page = a.payload.page; })
     .addCase(fetchEvents.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Something went wrong'; })
     .addCase(fetchEventDetails.pending, (s) => { s.selectedStatus = 'loading'; s.selected = null; s.selectedError = null; })
     .addCase(fetchEventDetails.fulfilled, (s, a) => { s.selectedStatus = 'succeeded'; s.selected = a.payload; })
     .addCase(fetchEventDetails.rejected, (s, a) => { s.selectedStatus = 'failed'; s.selectedError = a.payload; })
     .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; });
  },
});

export default eventsSlice.reducer;