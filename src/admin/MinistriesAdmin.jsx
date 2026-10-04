import { useState } from 'react';
import Modal from '../components/Modal';
import ImagePicker from './ImagePicker';
import { useAdminTable } from './useAdminTable';
import { useSaveForm } from './useSaveForm';
import { AddIcon, EmptyState, ErrorNote, FormActions, PageHeader, RowActions } from './ui';
import { ministryEmoji, ministryIcons } from '../data/ministries';
import { resolveImage } from '../utils/images';

function MinistryForm({ ministry, onSave, onCancel }) {
  const [values, setValues] = useState({
    name: ministry.name ?? '',
    description: ministry.description ?? '',
    leader: ministry.leader ?? '',
    schedule: ministry.schedule ?? '',
    icon: ministry.icon ?? '',
    image: ministry.image ?? '',
  });
  const { saving, error, submit } = useSaveForm(onSave);
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) =>
    submit(e, {
      name: values.name.trim(),
      description: values.description.trim(),
      leader: values.leader.trim() || null,
      schedule: values.schedule.trim() || null,
      icon: values.icon || null,
      image: values.image || null,
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          <label htmlFor="ministry-name" className="form-label">Name</label>
          <input id="ministry-name" required value={values.name} onChange={set('name')} className="form-input" />
        </div>
        <div>
          <label htmlFor="ministry-icon" className="form-label">Icon</label>
          <select id="ministry-icon" value={values.icon} onChange={set('icon')} className="form-input pr-8">
            {Object.entries(ministryIcons).map(([key, { emoji, label }]) => (
              <option key={key} value={key}>{emoji} {label}</option>
            ))}
            <option value="">✝️ Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ministry-description" className="form-label">Description</label>
        <textarea id="ministry-description" required rows={3} value={values.description} onChange={set('description')} className="form-input" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ministry-leader" className="form-label">Leader <span className="text-charcoal/50 font-normal">(optional)</span></label>
          <input id="ministry-leader" value={values.leader} onChange={set('leader')} placeholder="e.g. Bro. David Kimani" className="form-input" />
        </div>
        <div>
          <label htmlFor="ministry-schedule" className="form-label">When they meet <span className="text-charcoal/50 font-normal">(optional)</span></label>
          <input id="ministry-schedule" value={values.schedule} onChange={set('schedule')} placeholder="e.g. Fridays, 6:00 PM" className="form-input" />
        </div>
      </div>

      <div>
        <p className="form-label">Image <span className="text-charcoal/50 font-normal">(optional)</span></p>
        <ImagePicker id="ministry-image" value={values.image} onChange={(image) => setValues((v) => ({ ...v, image }))} />
      </div>

      <FormActions saving={saving} onCancel={onCancel} error={error} />
    </form>
  );
}

export default function MinistriesAdmin() {
  const { rows, loading, error, mutate, reorder, nextSortOrder } = useAdminTable('ministries');
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

  const handleDelete = (ministry) => {
    if (!window.confirm(`Delete “${ministry.name}”? This can’t be undone.`)) return;
    runAction(() => mutate((q) => q.delete().eq('id', ministry.id)), "Couldn't delete");
  };

  return (
    <>
      <PageHeader
        title="Ministries"
        description="Shown on the Ministries page in this order. The first six also appear on the home page."
        action={
          <button type="button" onClick={() => setEditing({ icon: 'youth' })} className="btn-primary">
            <AddIcon /> Add ministry
          </button>
        }
      />
      <ErrorNote>{error || actionError}</ErrorNote>

      {!loading && rows.length === 0 && !error && <EmptyState>No ministries yet.</EmptyState>}

      {rows.length > 0 && (
        <ol className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {rows.map((ministry, i) => {
            const image = resolveImage(ministry.image);
            return (
              <li key={ministry.id} className="flex items-center gap-3 p-3 sm:p-4">
                <div className="w-16 sm:w-24 aspect-video rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
                  {image ? <img src={image} alt="" className="w-full h-full object-cover" loading="lazy" /> : <span aria-hidden="true">{ministryEmoji(ministry.icon)}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-royal truncate">
                    <span aria-hidden="true">{ministryEmoji(ministry.icon)}</span> {ministry.name}
                    {i < 6 && <span className="ml-2 align-middle text-[0.65rem] font-sans font-semibold uppercase tracking-wide text-gold">Home page</span>}
                  </p>
                  <p className="text-sm text-charcoal/70 truncate">
                    {[ministry.leader, ministry.schedule].filter(Boolean).join(' · ') || ministry.description}
                  </p>
                </div>
                <RowActions
                  name={ministry.name}
                  onMoveUp={i > 0 ? () => runAction(() => reorder(i, i - 1), "Couldn't reorder") : null}
                  onMoveDown={i < rows.length - 1 ? () => runAction(() => reorder(i, i + 1), "Couldn't reorder") : null}
                  onEdit={() => setEditing(ministry)}
                  onDelete={() => handleDelete(ministry)}
                />
              </li>
            );
          })}
        </ol>
      )}

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Edit ministry' : 'Add ministry'}>
        {editing && (
          <MinistryForm key={editing.id ?? 'new'} ministry={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </>
  );
}
