import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Set by AdminFormModal: { reportDirty, requestClose, askingToDiscard, keepEditing, discard }.
 * Lets the form inside tell the dialog it has unsaved edits, so closing it asks first.
 */
export const FormModalContext = createContext(null);

export const useFormModal = () => useContext(FormModalContext);

const sameValues = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Form values with change tracking.
 * field(name) spreads value + onChange onto an input; dirty is true once anything differs
 * from the last saved values; markSaved() makes the current values the new baseline.
 */
export function useFormValues(initial) {
  const [values, setValues] = useState(initial);
  const [baseline, setBaseline] = useState(initial);
  const dirty = !sameValues(values, baseline);
  const modal = useFormModal();

  useEffect(() => {
    modal?.reportDirty(dirty);
  }, [modal, dirty]);

  useEffect(() => () => modal?.reportDirty(false), [modal]);

  const setValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));
  const field = (name) => ({ value: values[name] ?? '', onChange: (e) => setValue(name, e.target.value) });

  return { values, setValue, field, dirty, markSaved: () => setBaseline(values) };
}

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
