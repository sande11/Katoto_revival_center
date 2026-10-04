import { useEffect, useState } from 'react';
import { sermons } from '../data/sermons';
import { ministries } from '../data/ministries';
import { serviceTimes } from '../data/serviceTimes';

/**
 * Site content managed from the admin dashboard. Reads come from Supabase;
 * until it is configured (or if a request fails) the static files in src/data are used.
 */
const tables = {
  sermons: { orderBy: [['date', false], ['created_at', false]], fallback: sermons },
  ministries: { orderBy: [['sort_order', true], ['created_at', true]], fallback: ministries },
  service_times: { orderBy: [['sort_order', true], ['created_at', true]], fallback: serviceTimes },
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
