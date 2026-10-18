import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearAuthError } from '../features/auth/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate())
      dispatch(register({ name: form.name.trim(), email: form.email.toLowerCase(), password: form.password }));
  };

  return (
    <div className="form-page">
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <h2>Create account</h2>
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        {errors.name && <small className="error">{errors.name}</small>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <small className="error">{errors.email}</small>}
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        {errors.password && <small className="error">{errors.password}</small>}
        <input name="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={handleChange} />
        {errors.confirm && <small className="error">{errors.confirm}</small>}
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}