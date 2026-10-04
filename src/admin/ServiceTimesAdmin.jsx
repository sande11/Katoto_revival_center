import { useState } from 'react';
import Modal from '../components/Modal';
import { useAdminTable } from './useAdminTable';
import { useSaveForm } from './useSaveForm';
import { AddIcon, EmptyState, ErrorNote, FormActions, PageHeader, RowActions } from './ui';

const daySuggestions = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  'First Saturday', 'Second Saturday', 'Last Friday',
];

function ServiceTimeForm({ serviceTime, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: serviceTime.name ?? '',
    day: serviceTime.day ?? '',
    time: serviceTime.time ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) =>
    submit(e, { name: values.name.trim(), day: values.day.trim(), time: values.time.trim() });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="service-name" className="form-label">Service</label>
        <input id="service-name" required value={values.name} onChange={set('name')} placeholder="e.g. Sunday Worship" className="form-input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="service-day" className="form-label">Day</label>
          <input id="service-day" required list="service-days" value={values.day} onChange={set('day')} placeholder="e.g. Sunday" className="form-input" />
          <datalist id="service-days">
            {daySuggestions.map((d) => <option key={d} value={d} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="service-time" className="form-label">Time</label>
          <input id="service-time" required value={values.time} onChange={set('time')} placeholder="e.g. 9:00 AM" className="form-input" />
        </div>
      </div>
      <FormActions saving={saving} onCancel={onCancel} error={error} />
    </form>
  );
}

export default function ServiceTimesAdmin() {
  const { rows, loading, error, mutate, reorder, nextSortOrder } = useAdminTable('service_times');
  const [editing, setEditing] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleSave = async (values) => {
    if (editing.id) await mutate((q) => q.update(values).eq('id', editing.id));
    else await mutate((q) => q.insert({ ...values, sort_order: nextSortOrder }));
    setEditing(null);
  };

  const runAction = async (action, failure) => {
    setActionError('');
    try {
      await action();
    } catch (err) {
      setActionError(`${failure}: ${err.message}`);
    }
  };

  const handleDelete = (serviceTime) => {
    if (!window.confirm(`Delete “${serviceTime.name}”? This can’t be undone.`)) return;
    runAction(() => mutate((q) => q.delete().eq('id', serviceTime.id)), "Couldn't delete");
  };

  return (
    <>
      <PageHeader
        title="Service Times"
        description="Shown in the footer and on the Plan Your Visit page. The first one is also shown on the home page."
        action={
          <button type="button" onClick={() => setEditing({})} className="btn-primary">
            <AddIcon /> Add service time
          </button>
        }
      />
      <ErrorNote>{error || actionError}</ErrorNote>

      {!loading && rows.length === 0 && !error && <EmptyState>No service times yet.</EmptyState>}

      {rows.length > 0 && (
        <ol className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {rows.map((serviceTime, i) => (
            <li key={serviceTime.id} className="flex items-center gap-3 p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-royal truncate">
                  {serviceTime.name}
                  {i === 0 && <span className="ml-2 align-middle text-[0.65rem] font-semibold uppercase tracking-wide text-gold">Home page</span>}
                </p>
                <p className="text-sm text-charcoal/70">{serviceTime.day}, {serviceTime.time}</p>
              </div>
              <RowActions
                name={serviceTime.name}
                onMoveUp={i > 0 ? () => runAction(() => reorder(i, i - 1), "Couldn't reorder") : null}
                onMoveDown={i < rows.length - 1 ? () => runAction(() => reorder(i, i + 1), "Couldn't reorder") : null}
                onEdit={() => setEditing(serviceTime)}
                onDelete={() => handleDelete(serviceTime)}
              />
            </li>
          ))}
        </ol>
      )}

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Edit service time' : 'Add service time'} size="small">
        {editing && (
          <ServiceTimeForm key={editing.id ?? 'new'} serviceTime={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </>
  );
}
