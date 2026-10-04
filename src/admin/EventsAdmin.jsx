import { useState } from 'react';
import Modal from '../components/Modal';
import ImagePicker from './ImagePicker';
import { useAdminTable } from './useAdminTable';
import { useSaveForm } from './useSaveForm';
import { AddIcon, EmptyState, ErrorNote, FormActions, PageHeader, RowActions } from './ui';
import { resolveImage } from '../utils/images';

function EventForm({ event, onSave, onCancel }) {
  const [values, setValues] = useState({ title: event.title ?? '', date: event.date ?? '', time: event.time ?? '', location: event.location ?? '', description: event.description ?? '', image: event.image ?? '', rsvp_link: event.rsvp_link ?? event.rsvpLink ?? '', is_past: event.is_past ?? false });
  const { saving, error, submit } = useSaveForm(onSave);
  const set = (field) => (e) => setValues((current) => ({ ...current, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  return <form onSubmit={(e) => submit(e, { ...values, title: values.title.trim(), time: values.time.trim(), location: values.location.trim(), description: values.description.trim(), image: values.image || null, rsvp_link: values.rsvp_link.trim() || null })} className="space-y-5">
    <div><label htmlFor="event-title" className="form-label">Event title</label><input id="event-title" required value={values.title} onChange={set('title')} className="form-input" /></div>
    <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="event-date" className="form-label">Date</label><input id="event-date" type="date" required value={values.date} onChange={set('date')} className="form-input" /></div><div><label htmlFor="event-time" className="form-label">Time</label><input id="event-time" required value={values.time} onChange={set('time')} placeholder="e.g. 9:00 AM" className="form-input" /></div></div>
    <div><label htmlFor="event-location" className="form-label">Location</label><input id="event-location" required value={values.location} onChange={set('location')} className="form-input" /></div>
    <div><label htmlFor="event-description" className="form-label">Description</label><textarea id="event-description" required rows={3} value={values.description} onChange={set('description')} className="form-input" /></div>
    <div><label htmlFor="event-rsvp" className="form-label">RSVP link <span className="text-charcoal/50 font-normal">(optional)</span></label><input id="event-rsvp" type="text" value={values.rsvp_link} onChange={set('rsvp_link')} placeholder="e.g. /contact or https://…" className="form-input" /></div>
    <div><p className="form-label">Image <span className="text-charcoal/50 font-normal">(optional)</span></p><ImagePicker id="event-image" value={values.image} onChange={(image) => setValues((current) => ({ ...current, image }))} /></div>
    <label className="flex items-center gap-3 text-sm text-charcoal"><input type="checkbox" checked={values.is_past} onChange={set('is_past')} className="w-5 h-5 accent-royal" />Show in Past Events</label>
    <FormActions saving={saving} onCancel={onCancel} error={error} />
  </form>;
}

export default function EventsAdmin() {
  const { rows, loading, error, mutate } = useAdminTable('events');
  const [editing, setEditing] = useState(null); const [actionError, setActionError] = useState('');
  const save = async (values) => { if (editing.id) await mutate((q) => q.update(values).eq('id', editing.id)); else await mutate((q) => q.insert(values)); setEditing(null); };
  const remove = async (event) => { if (!window.confirm(`Delete “${event.title}”? This can’t be undone.`)) return; try { setActionError(''); await mutate((q) => q.delete().eq('id', event.id)); } catch (err) { setActionError(`Couldn't delete: ${err.message}`); } };
  return <><PageHeader title="Events" description="Add upcoming gatherings and past-event memories for the Events page." action={<button type="button" onClick={() => setEditing({})} className="btn-primary"><AddIcon /> Add event</button>} /><ErrorNote>{error || actionError}</ErrorNote>{!loading && !rows.length && !error && <EmptyState>No events yet.</EmptyState>}{rows.length > 0 && <ul className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">{rows.map((event) => <li key={event.id} className="flex gap-3 p-3 sm:p-4 items-center"><div className="w-20 aspect-video rounded-md bg-gray-100 overflow-hidden flex-shrink-0">{resolveImage(event.image) && <img src={resolveImage(event.image)} alt="" className="w-full h-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="font-semibold text-royal truncate">{event.title} {event.is_past && <span className="text-xs font-sans font-medium text-charcoal/50">Past event</span>}</p><p className="text-sm text-charcoal/70 truncate">{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US')} · {event.time} · {event.location}</p></div><RowActions name={event.title} onEdit={() => setEditing(event)} onDelete={() => remove(event)} /></li>)}</ul>}<Modal isOpen={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? 'Edit event' : 'Add event'}>{editing && <EventForm key={editing.id ?? 'new'} event={editing} onSave={save} onCancel={() => setEditing(null)} />}</Modal></>;
}
