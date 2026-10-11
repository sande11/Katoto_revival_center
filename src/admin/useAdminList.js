import { useCallback, useState } from 'react';
import { useAdminTable } from './useAdminTable';
import { useFeedback } from './feedback';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Everything a list screen needs on top of useAdminTable: which row is open in the form,
 * save (insert or update), delete with a confirmation dialog, reorder, and one-off updates.
 * Results are reported as toasts.
 *
 *   noun    — what one row is called, e.g. 'sermon'
 *   nameOf  — row => the name shown in messages, e.g. (s) => s.title
 *   ordered — new rows go to the end of a sort_order list
 */
export function useAdminList(table, { noun, nameOf, ordered = false, deleteMessage }) {
  const list = useAdminTable(table);
  const { toast, confirm } = useFeedback();
  const [editing, setEditing] = useState(null);
  // Stable so they can be effect dependencies and keep AdminFormModal's context steady
  const startAdding = useCallback((defaults = {}) => setEditing(defaults), []);
  const startEditing = useCallback((row) => setEditing(row), []);
  const closeForm = useCallback(() => setEditing(null), []);

  const save = async (values) => {
    const isNew = !editing?.id;
    if (isNew) await list.mutate((q) => q.insert(ordered ? { ...values, sort_order: list.nextSortOrder } : values));
    else await list.mutate((q) => q.update(values).eq('id', editing.id));
    setEditing(null);
    toast(`${capitalize(noun)} ${isNew ? 'added' : 'saved'}`);
  };

  const remove = async (row) => {
    const name = nameOf(row);
    const ok = await confirm({
      title: `Delete this ${noun}?`,
      message: deleteMessage?.(row) ?? `“${name}” will be removed from the website. This can’t be undone.`,
    });
    if (!ok) return;
    try {
      await list.mutate((q) => q.delete().eq('id', row.id));
      toast(`${capitalize(noun)} deleted`);
    } catch (err) {
      toast(`Couldn’t delete: ${err.message}`, { tone: 'error' });
    }
  };

  const move = async (from, to) => {
    try {
      await list.reorder(from, to);
    } catch (err) {
      toast(`Couldn’t change the order: ${err.message}`, { tone: 'error' });
    }
  };

  /** One-off write with a success toast, e.g. update(q => q.update({ is_read: true }).eq('id', id), 'Marked as read'). */
  const update = async (request, successMessage) => {
    try {
      await list.mutate(request);
      if (successMessage) toast(successMessage);
    } catch (err) {
      toast(`Couldn’t save: ${err.message}`, { tone: 'error' });
    }
  };

  return {
    ...list,
    editing,
    startAdding,
    startEditing,
    closeForm,
    save,
    remove,
    move,
    update,
  };
}

/** The usual edit / move up / move down / delete actions for a row in an ordered list. */
export function orderedRowActions(list, row, index) {
  return [
    { label: 'Edit', icon: 'edit', onClick: () => list.startEditing(row) },
    { label: 'Move up', icon: 'up', onClick: () => list.move(index, index - 1), disabled: index === 0 },
    { label: 'Move down', icon: 'down', onClick: () => list.move(index, index + 1), disabled: index === list.rows.length - 1 },
    { label: 'Delete', icon: 'trash', onClick: () => list.remove(row), danger: true },
  ];
}
