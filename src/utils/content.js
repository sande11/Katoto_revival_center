import { useEffect, useState } from 'react';
import { sermons } from '../data/sermons';
import { ministries } from '../data/ministries';
import { serviceTimes } from '../data/serviceTimes';
import { upcomingEvents, pastEvents } from '../data/events';
import { bankAccounts, mobileMoney } from '../data/giving';
import { churchContact } from '../data/contact';
import { aboutContent } from '../data/aboutContent';
import { beliefs } from '../data/beliefs';
import { team } from '../data/team';
import { publicPrayerRequests } from '../data/prayerRequests';

/**
 * Site content managed from the admin dashboard. Reads come from Supabase;
 * until it is configured (or if a request fails) the static files in src/data are used.
 */
const tables = {
  sermons: { orderBy: [['date', false], ['created_at', false]], fallback: sermons },
  ministries: { orderBy: [['sort_order', true], ['created_at', true]], fallback: ministries },
  service_times: { orderBy: [['sort_order', true], ['created_at', true]], fallback: serviceTimes },
  about_content: { orderBy: [['updated_at', false]], fallback: [aboutContent] },
  beliefs: { orderBy: [['sort_order', true], ['created_at', true]], fallback: beliefs },
  team_members: { orderBy: [['sort_order', true], ['created_at', true]], fallback: team },
  events: {
    orderBy: [['is_past', true], ['date', true], ['created_at', true]],
    fallback: [
      ...upcomingEvents.map((event) => ({ ...event, is_past: false })),
      ...pastEvents.map((event) => ({ ...event, is_past: true })),
    ],
  },
  giving_methods: {
    orderBy: [['sort_order', true], ['created_at', true]],
    fallback: [
      ...bankAccounts.map((item) => ({ kind: 'bank', provider: item.bank, label: item.accountName, value: item.accountNumber })),
      ...mobileMoney.map((item) => ({ kind: 'mobile', provider: item.provider, label: item.label, value: item.value })),
    ],
  },
  contact_settings: { orderBy: [['updated_at', false]], fallback: [{ ...churchContact, phone_display: churchContact.phoneDisplay, map_embed_url: churchContact.mapEmbedUrl, directions_url: churchContact.directionsUrl, whatsapp_url: churchContact.whatsappUrl, facebook_url: churchContact.facebookUrl, youtube_url: churchContact.youtubeUrl }] },
  public_prayer_requests: { orderBy: [['date', false]], fallback: publicPrayerRequests },
  contact_messages: { orderBy: [['created_at', false]], fallback: [] },
  prayer_requests: { orderBy: [['created_at', false]], fallback: [] },
};

const configured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const requests = {};
// Rows already loaded, so pages revisited in the same session render without a loading flash
const loaded = configured ? {} : Object.fromEntries(Object.entries(tables).map(([t, { fallback }]) => [t, fallback]));

export async function selectOrdered(supabase, table) {
  let query = supabase.from(table).select('*');
  for (const [column, ascending] of tables[table].orderBy) {
    query = query.order(column, { ascending });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

function fetchContent(table) {
  requests[table] ??= import('./supabase')
    .then(({ supabase }) => selectOrdered(supabase, table))
    .catch((err) => {
      console.error(`Could not load ${table}; showing built-in content instead.`, err);
      return tables[table].fallback;
    })
    .then((rows) => {
      loaded[table] = rows;
      return rows;
    });
  return requests[table];
}

/** Call after the admin dashboard changes a table so public pages pick up the edit. */
export function invalidateContent(table) {
  delete requests[table];
  if (configured) delete loaded[table];
}

/** Rows for one content table: { data, loading }. data is [] while loading. */
export function useContent(table) {
  const [data, setData] = useState(() => loaded[table]);

  useEffect(() => {
    if (loaded[table]) return;
    let active = true;
    fetchContent(table).then((rows) => {
      if (active) setData(rows);
    });
    return () => {
      active = false;
    };
  }, [table]);

  return { data: data ?? [], loading: data === undefined };
}
