const BASE = 'https://app.ticketmaster.com/discovery/v2';
const KEY = import.meta.env.VITE_TM_API_KEY;

const clean = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null));

async function request(path, params = {}) {
  const query = new URLSearchParams({ apikey: KEY, ...clean(params) });
  const res = await fetch(`${BASE}${path}?${query}`);
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return res.json();
}

export async function fetchEventsApi(params) {
  const data = await request('/events.json', { size: 12, sort: 'date,asc', ...params });
  return { events: data._embedded?.events || [], page: data.page };
}

export const fetchEventByIdApi = (id) => request(`/events/${id}.json`);

export async function fetchClassificationsApi() {
  const data = await request('/classifications.json', { size: 20 });
  return data._embedded?.classifications || [];
}