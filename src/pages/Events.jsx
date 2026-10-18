import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchCategories } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';

export default function Events() {
  const dispatch = useDispatch();
  const { list, status, error, categories, page } = useSelector((s) => s.events);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [upcoming, setUpcoming] = useState(true);
  const [pageNo, setPageNo] = useState(0);

  const segments = [...new Set(categories.map((c) => c.segment?.name).filter(Boolean))];

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  // debounce: waits 500ms after typing (API limit is 2 requests/second)
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchEvents({
        keyword, city, page: pageNo,
        classificationName: category,
        startDateTime: upcoming ? new Date().toISOString().split('.')[0] + 'Z' : '',
      }));
    }, 500);
    return () => clearTimeout(t);
  }, [keyword, city, category, upcoming, pageNo, dispatch]);

  const change = (setter) => (e) => { setter(e.target.value); setPageNo(0); };

  return (
    <div className="container">
      <h1>Explore Events</h1>
      <div className="filters">
        <input placeholder="Search events..." value={keyword} onChange={change(setKeyword)} />
        <input placeholder="City" value={city} onChange={change(setCity)} />
        <select value={category} onChange={change(setCategory)}>
          <option value="">All categories</option>
          {segments.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <label>
          <input type="checkbox" checked={upcoming}
            onChange={(e) => { setUpcoming(e.target.checked); setPageNo(0); }} /> Upcoming only
        </label>
      </div>

      <div className="chips">
        <button className={!category ? 'chip active' : 'chip'} onClick={() => { setCategory(''); setPageNo(0); }}>All</button>
        {segments.map((s) => (
          <button key={s} className={category === s ? 'chip active' : 'chip'}
            onClick={() => { setCategory(s); setPageNo(0); }}>{s}</button>
        ))}
      </div>

      {status === 'loading' && <Loader />}
      {status === 'failed' && <ErrorMessage message={error} />}
      {status === 'succeeded' && list.length === 0 && <p className="center muted">No events found.</p>}

      <div className="grid">
        {list.map((e) => <EventCard key={e.id} event={e} />)}
      </div>

      {page && (
        <div className="pager">
          <button disabled={pageNo === 0} onClick={() => setPageNo(pageNo - 1)}>Previous</button>
          <span>Page {pageNo + 1}</span>
          <button disabled={pageNo + 1 >= page.totalPages} onClick={() => setPageNo(pageNo + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}