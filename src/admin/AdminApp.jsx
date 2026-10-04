import { Navigate, Route, Routes } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import AdminAuthProvider from './AdminAuthProvider';
import AdminCenteredCard from './AdminCenteredCard';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Login from './Login';
import MinistriesAdmin from './MinistriesAdmin';
import RequireAdmin from './RequireAdmin';
import SermonsAdmin from './SermonsAdmin';
import ServiceTimesAdmin from './ServiceTimesAdmin';

/** Everything under /admin. Loaded lazily from App.jsx. */
export default function AdminApp() {
  if (!supabase) {
    return (
      <AdminCenteredCard title="Admin not set up">
        <p className="text-charcoal text-sm">
          Add <code className="text-royal">VITE_SUPABASE_URL</code> and{' '}
          <code className="text-royal">VITE_SUPABASE_PUBLISHABLE_KEY</code> to the environment (see{' '}
          <code className="text-royal">.env.example</code>), then rebuild the site.
        </p>
      </AdminCenteredCard>
    );
  }

  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="sermons" element={<SermonsAdmin />} />
          <Route path="ministries" element={<MinistriesAdmin />} />
          <Route path="service-times" element={<ServiceTimesAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
