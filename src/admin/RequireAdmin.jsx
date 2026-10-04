import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './auth';
import AdminCenteredCard from './AdminCenteredCard';

/** Shows its children only to signed-in admins; everyone else goes to the login page. */
export default function RequireAdmin({ children }) {
  const { status, user, signOut } = useAdminAuth();
  const location = useLocation();

  if (status === 'loading') return <div className="min-h-screen bg-gray-50" />;
  if (status === 'signed-out') return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (status === 'not-admin') {
    return (
      <AdminCenteredCard title="No admin access">
        <p className="text-charcoal mb-5">
          <strong>{user.email}</strong> is signed in but isn&rsquo;t an admin. Ask the site administrator to add this
          account, then sign in again.
        </p>
        <button type="button" onClick={signOut} className="btn-secondary w-full">
          Sign out
        </button>
      </AdminCenteredCard>
    );
  }
  return children;
}
