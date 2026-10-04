import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAdminAuth } from './auth';
import AdminCenteredCard from './AdminCenteredCard';

export default function Login() {
  const { status } = useAdminAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'admin' || status === 'not-admin') {
    return <Navigate to={location.state?.from || '/admin'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    // On success the auth listener updates status and the redirect above takes over
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? 'Wrong email or password.' : signInError.message);
      setSubmitting(false);
    }
  };

  return (
    <AdminCenteredCard title="Admin sign in">
      <Helmet>
        <title>Admin sign in — Katoto Revival Center</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="form-label">Email</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="form-label">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <button type="submit" disabled={submitting || status === 'loading'} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AdminCenteredCard>
  );
}
