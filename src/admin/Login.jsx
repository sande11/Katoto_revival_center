import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAdminAuth } from './auth';
import AdminCenteredCard from './AdminCenteredCard';
import Icon from './Icon';
import { Field } from './ui';

export default function Login() {
  const { status } = useAdminAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(signInError.message === 'Invalid login credentials' ? 'That email and password don’t match. Check them and try again.' : signInError.message);
      setSubmitting(false);
    }
  };

  return (
    <AdminCenteredCard title="Sign in" subtitle="Manage sermons, events and messages for the church website.">
      <Helmet>
        <title>Admin sign in — Katoto Assemblies of God</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="admin-email" label="Email">
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </Field>
        <Field id="admin-password" label="Password">
          <div className="relative">
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg text-charcoal/50 hover:text-royal"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              <Icon name={showPassword ? 'eyeSlash' : 'eye'} />
            </button>
          </div>
        </Field>
        {error && (
          <p className="flex gap-2 text-sm text-red-600" role="alert">
            <Icon name="alert" className="w-5 h-5" /> {error}
          </p>
        )}
        <button type="submit" disabled={submitting || status === 'loading'} className="btn-primary w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-center text-charcoal/60">
          Forgot your password? Ask another admin to reset it in Supabase under Authentication → Users.
        </p>
      </form>
    </AdminCenteredCard>
  );
}
