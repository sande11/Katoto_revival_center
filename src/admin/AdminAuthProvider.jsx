import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { AdminAuthContext } from './auth';

async function checkAdmin(user) {
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (error) console.error('Could not check admin access', error);
  return Boolean(data);
}

export default function AdminAuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null });

  useEffect(() => {
    let currentUserId; // undefined until the first event, null when signed out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      // Token refreshes fire this too; only re-check when the signed-in user changes
      if ((user?.id ?? null) === currentUserId) return;
      currentUserId = user?.id ?? null;

      if (!user) {
        setState({ status: 'signed-out', user: null });
        return;
      }
      // Supabase warns against awaiting its own calls inside this callback, so defer the lookup
      setTimeout(async () => {
        const isAdmin = await checkAdmin(user);
        if (currentUserId === user.id) setState({ status: isAdmin ? 'admin' : 'not-admin', user });
      }, 0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const value = { ...state, signOut: () => supabase.auth.signOut() };
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
