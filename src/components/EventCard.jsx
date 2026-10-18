import { Link } from 'react-router-dom';
import { bestImage, formatDate } from '../utils/eventHelpers';

export default function EventCard({ event }) {
  const venue = event._embedded?.venues?.[0];
  return (
    <div className="card event-card">
      <img src={bestImage(event)} alt={event.name} loading="lazy" />
      <div className="event-body">
        <span className="tag">{event.classifications?.[0]?.segment?.name || 'Event'}</span>
        <h3>{event.name}</h3>
        <p className="muted">{formatDate(event)}</p>
        <p className="muted">{venue?.name}{venue?.city ? `, ${venue.city.name}` : ''}</p>
        <Link to={`/events/${event.id}`} className="btn">View details</Link>
      </div>
    </div>
  );
}