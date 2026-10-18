import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">EventHub</Link>
      <div className="nav-links">
        <Link to="/">Events</Link>
        {user ? (
          <>
            <Link to="/my-events">My Events</Link>
            <span className="muted">Hi, {user.name}</span>
            <button onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}