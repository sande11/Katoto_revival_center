import { useState } from 'react';

/** Submit handling for an edit form: { saving, error, submit(event, values) }. */
export function useSaveForm(onSave) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e, values) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(values);
    } catch (err) {
      setError(`Couldn't save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return { saving, error, submit };
}
