import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { invalidateContent, selectOrdered } from '../utils/content';

/**
 * Rows of one content table for an admin screen.
 * Every write also clears the public site's cached copy so the change shows up straight away.
 */
export function useAdminTable(table) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setRows(await selectOrdered(supabase, table));
      setError('');
    } catch (err) {
      setError(`Couldn't load ${table.replace('_', ' ')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    reload();
  }, [reload]);

  /** Runs one write, e.g. mutate((q) => q.delete().eq('id', id)); throws if Supabase rejects it. */
  const mutate = useCallback(async (request) => {
    const { error: writeError } = await request(supabase.from(table));
    invalidateContent(table);
    if (writeError) throw writeError;
    await reload();
  }, [table, reload]);

  /** Moves a row and renumbers sort_order to match the new list order. */
  const reorder = useCallback(async (from, to) => {
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setRows(next);
    const results = await Promise.all(
      next.map((row, i) => (row.sort_order === i ? null : supabase.from(table).update({ sort_order: i }).eq('id', row.id))),
    );
    invalidateContent(table);
    await reload();
    const failed = results.find((r) => r?.error);
    if (failed) throw failed.error;
  }, [rows, table, reload]);

  const nextSortOrder = rows.length ? Math.max(...rows.map((r) => r.sort_order ?? 0)) + 1 : 0;

  return { rows, loading, error, mutate, reorder, nextSortOrder };
}
