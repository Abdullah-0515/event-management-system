import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventDetails } from '../features/events/eventsSlice';
import { bestImage, formatDate, summarize } from '../utils/eventHelpers';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { registerForEvent, cancelRegistration, clearMessage } from '../features/registrations/registrationsSlice';

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const { items, message } = useSelector((s) => s.registrations);
  const { selected: e, selectedStatus, selectedError } = useSelector((s) => s.events);

  useEffect(() => { dispatch(fetchEventDetails(id)); }, [id, dispatch]);
  useEffect(() => () => { dispatch(clearMessage()); }, [dispatch]);

  if (selectedStatus === 'loading') return <Loader />;
  if (selectedStatus === 'failed') return <ErrorMessage message={selectedError} />;
  if (!e) return null;

  const isRegistered = user && items.some((r) => r.userEmail === user.email && r.event.id === id);
  const handleRegister = () => {
    if (!user) return navigate('/login');
    dispatch(registerForEvent({ userEmail: user.email, event: summarize(e) }));
  };

  const venue = e._embedded?.venues?.[0];
  const cls = e.classifications?.[0];
  const price = e.priceRanges?.[0];

  return (
    <div className="container details">
      <Link to="/">← Back to events</Link>
      <img className="hero" src={bestImage(e)} alt={e.name} />
      <h1>{e.name}</h1>
      <p><b>Date & time:</b> {formatDate(e)}</p>
      <p><b>Venue:</b> {venue?.name}</p>
      <p><b>Location:</b> {[venue?.address?.line1, venue?.city?.name, venue?.state?.name, venue?.country?.name].filter(Boolean).join(', ')}</p>
      <p><b>Category:</b> {[cls?.segment?.name, cls?.genre?.name, cls?.subGenre?.name].filter(Boolean).join(' / ')}</p>
      {price && <p><b>Price:</b> {price.min} – {price.max} {price.currency}</p>}
      {e.dates?.status?.code && <p><b>Status:</b> {e.dates.status.code}</p>}
      {e.info && <p><b>Info:</b> {e.info}</p>}
      {e.pleaseNote && <p><b>Please note:</b> {e.pleaseNote}</p>}
      {message && <p className={message.type === 'error' ? 'error' : 'success'}>{message.text}</p>}
      {isRegistered ? (
        <button className="danger" onClick={() => dispatch(cancelRegistration({ userEmail: user.email, eventId: id }))}>
          Cancel registration
        </button>
      ) : (
        <button onClick={handleRegister}>Register for this event</button>
      )}
      {e.url && <p><a href={e.url} target="_blank" rel="noreferrer">View on Ticketmaster</a></p>}
    </div>
  );
}
