export const bestImage = (e) =>
  [...(e.images || [])].sort((a, b) => b.width - a.width)[0]?.url;

export const eventDate = (e) => e.dates?.start?.dateTime || e.dates?.start?.localDate;

export const isPast = (date) => date && new Date(date) < new Date();

export const formatDate = (e) => {
  const s = e.dates?.start;
  if (!s) return 'Date TBA';
  const d = new Date(s.dateTime || s.localDate);
  return d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    + (s.localTime ? ` · ${s.localTime.slice(0, 5)}` : '');
};

// Small copy of the event saved when registering (so My Events needs no extra API call)
export const summarize = (e) => ({
  id: e.id,
  name: e.name,
  image: bestImage(e),
  date: eventDate(e),
  dateText: formatDate(e),
  venue: e._embedded?.venues?.[0]?.name,
  city: e._embedded?.venues?.[0]?.city?.name,
  category: e.classifications?.[0]?.segment?.name,
});