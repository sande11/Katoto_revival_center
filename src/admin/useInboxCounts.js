import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { ADMIN_DATA_CHANGED } from './useAdminTable';

const inboxTables = ['contact_messages', 'prayer_requests'];

/**
 * Items waiting for an admin: unread contact messages and shared prayer requests not yet
 * published. Refreshes whenever the dashboard changes either table.
 */
export function useInboxCounts() {
  const [counts, setCounts] = useState({ messages: 0, prayer: 0 });

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [messages, prayer] = await Promise.all([
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('share_public', true).is('approved_at', null),
      ]);
      if (active) setCounts({ messages: messages.count ?? 0, prayer: prayer.count ?? 0 });
    };
    const handleChange = (e) => inboxTables.includes(e.detail) && load();

    load();
    window.addEventListener(ADMIN_DATA_CHANGED, handleChange);
    return () => {
      active = false;
      window.removeEventListener(ADMIN_DATA_CHANGED, handleChange);
    };
  }, []);

  return counts;
}
