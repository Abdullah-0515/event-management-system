import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelRegistration, clearMessage } from '../features/registrations/registrationsSlice';
import { isPast } from '../utils/eventHelpers';
import { useEffect } from 'react';

export default function MyEvents() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items, message } = useSelector((s) => s.registrations);
  useEffect(() => () => dispatch(clearMessage()), [dispatch]);

  const mine = items.filter((r) => r.userEmail === user.email);
  const upcoming = mine.filter((r) => !isPast(r.event.date));
  const completed = mine.filter((r) => isPast(r.event.date));

  const Row = ({ r, canCancel }) => (
    <div className="card row">
      {r.event.image && <img src={r.event.image} alt={r.event.name} />}
      <div className="grow">
        <h3><Link to={`/events/${r.event.id}`}>{r.event.name}</Link></h3>
        <p className="muted">{r.event.dateText}</p>
        <p className="muted">{r.event.venue}{r.event.city ? `, ${r.event.city}` : ''}</p>
      </div>
      {canCancel && (
        <button className="danger"
          onClick={() => dispatch(cancelRegistration({ userEmail: user.email, eventId: r.event.id }))}>
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="container">
      <h1>My Events</h1>
      {message && <p className="success">{message.text}</p>}
      <h2>Upcoming ({upcoming.length})</h2>
      {upcoming.length === 0 && <p className="muted">No upcoming events. <Link to="/">Browse events</Link></p>}
      {upcoming.map((r) => <Row key={r.event.id} r={r} canCancel />)}
      <h2>Completed ({completed.length})</h2>
      {completed.length === 0 && <p className="muted">No completed events yet.</p>}
      {completed.map((r) => <Row key={r.event.id} r={r} canCancel={false} />)}
    </div>
  );
}